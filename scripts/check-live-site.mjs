const site = new URL(
  process.env.ROSCLAW_SITE_URL ?? "https://www.rosclaw.io",
);
const canonicalSite = new URL(
  process.env.ROSCLAW_CANONICAL_URL ?? "https://www.rosclaw.io",
);
const timeoutMs = Number(process.env.ROSCLAW_SITE_TIMEOUT_MS ?? 20_000);
const requireRegistry = process.env.ROSCLAW_REQUIRE_REGISTRY !== "0";
const errors = [];

const expectedPages = [
  ["/", "Trustworthy Physical Execution Runtime"],
  ["/start", "Choose what you have."],
  ["/robots", "Support is a matrix, not a badge."],
  ["/apps", "Tasks without device-specific control."],
  ["/evidence", "Claims point to inspectable records."],
  ["/status", "Canonical product status"],
  ["/hub", "Interfaces expose the body."],
  ["/hub/mcps", "Hardware MCPs"],
  ["/hub/skills", "Behavior package registry"],
  ["/hub/twins", "Simulation is evidence"],
  ["/hub/models", "No installable catalog is published."],
  ["/runtime", "Core Runtime Capabilities"],
  ["/docs", "ROSClaw Docs"],
  ["/flywheel", "Praxis Data Flywheel"],
];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function absolute(path) {
  return new URL(path, site).toString();
}

function canonicalPath(path) {
  const url = new URL(path, canonicalSite);
  url.search = "";
  url.hash = "";
  return url.pathname === "/" ? url.origin : url.toString();
}

function registryPath(name) {
  return name.split("/").map(encodeURIComponent).join("/");
}

function canonicalFrom(html) {
  return html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
}

async function request(path, init = {}) {
  try {
    return await fetch(absolute(path), {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    errors.push(`${path} request failed: ${error.message}`);
    return null;
  }
}

for (const [path, marker] of expectedPages) {
  const response = await request(path);
  if (!response) continue;
  const html = await response.text();
  assert(response.status === 200, `${path} returned ${response.status}.`);
  assert(html.includes(marker), `${path} is missing its product marker.`);
  assert(/<title>[^<]+<\/title>/.test(html), `${path} has no title.`);
  assert(
    /<meta name="description" content="[^"]+"/.test(html),
    `${path} has no meta description.`,
  );
  assert(
    canonicalFrom(html) === canonicalPath(path),
    `${path} canonical is not self-referential.`,
  );
  for (const stale of ["v0.8.2", "Ready today", "ALLOW_WITH_LIMITS"]) {
    assert(!html.includes(stale), `${path} contains stale claim: ${stale}.`);
  }
}

const root = await request("/");
if (root) {
  const requiredHeaders = {
    "content-security-policy": "frame-ancestors 'none'",
    "permissions-policy": "camera=()",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
  };
  for (const [name, value] of Object.entries(requiredHeaders)) {
    assert(
      root.headers.get(name)?.includes(value),
      `Missing or invalid ${name} response header.`,
    );
  }
}

for (const [legacy, current] of [
  ["/mcp-hub", "/hub/mcps"],
  ["/skills", "/hub/skills"],
]) {
  const response = await request(legacy, { redirect: "manual" });
  if (!response) continue;
  assert(response.status === 308, `${legacy} must return a permanent 308 redirect.`);
  assert(
    new URL(response.headers.get("location") ?? "", site).pathname === current,
    `${legacy} does not redirect to ${current}.`,
  );
}

let mcpPackages = [];
let skills = [];
const mcpResponse = requireRegistry ? await request("/api/mcp-packages") : null;
const skillResponse = requireRegistry ? await request("/api/skills") : null;
if (mcpResponse) {
  assert(mcpResponse.status === 200, "MCP Registry API is unavailable.");
  mcpPackages = await mcpResponse.json();
  assert(Array.isArray(mcpPackages) && mcpPackages.length > 0, "MCP Registry is empty.");
  if (mcpPackages[0]) {
    assert(
      typeof mcpPackages[0].manifestValidated === "boolean",
      "MCP Registry omits explicit manifest validation state.",
    );
    assert(
      mcpPackages[0].verified === mcpPackages[0].manifestValidated,
      "Legacy MCP verified state disagrees with manifest validation evidence.",
    );
  }
}
if (skillResponse) {
  assert(skillResponse.status === 200, "Skill Registry API is unavailable.");
  skills = await skillResponse.json();
  assert(Array.isArray(skills) && skills.length > 0, "Skill Registry is empty.");
}

for (const [path, items, matchLabel, detailPrefix] of [
  ["/hub/mcps", mcpPackages, "interfaces matched", "/hub/mcps/"],
  ["/hub/skills", skills, "skills matched", "/hub/skills/"],
]) {
  if (!items.length) continue;
  const response = await request(path);
  if (!response) continue;
  const html = await response.text();
  assert(
    html.includes(`${items.length.toLocaleString()} ${matchLabel}`),
    `${path} does not server-render its registry count.`,
  );
  assert(
    html.includes(`href="${detailPrefix}`),
    `${path} does not server-render any registry cards.`,
  );
  assert(
    !html.includes("Indexing registry"),
    `${path} returned a client-only registry placeholder.`,
  );
}

const dynamicExamples = [];
if (mcpPackages[0]) {
  dynamicExamples.push([
    `/hub/mcps/${registryPath(mcpPackages[0].name)}`,
    mcpPackages[0].name,
    `/mcp-hub/${registryPath(mcpPackages[0].name)}`,
  ]);
}
if (skills[0]) {
  dynamicExamples.push([
    `/hub/skills/${registryPath(skills[0].name)}`,
    skills[0].name,
    `/skills/${registryPath(skills[0].name)}`,
  ]);
}
for (const [path, name, legacy] of dynamicExamples) {
  const response = await request(path);
  if (!response) continue;
  const html = await response.text();
  assert(response.status === 200, `${path} returned ${response.status}.`);
  assert(html.includes("<h1"), `${path} has no server-rendered H1.`);
  assert(html.includes(name), `${path} has no server-rendered registry data.`);
  assert(canonicalFrom(html) === canonicalPath(path), `${path} canonical is incorrect.`);

  const redirect = await request(legacy, { redirect: "manual" });
  if (!redirect) continue;
  assert(redirect.status === 308, `${legacy} must return a permanent 308 redirect.`);
  assert(
    new URL(redirect.headers.get("location") ?? "", site).pathname === new URL(path, site).pathname,
    `${legacy} redirects to the wrong detail path.`,
  );
}

const sitemapResponse = await request("/sitemap.xml");
if (sitemapResponse) {
  const sitemap = await sitemapResponse.text();
  assert(sitemapResponse.status === 200, "sitemap.xml is unavailable.");
  for (const path of ["/robots", "/apps", "/evidence", "/status", "/hub/mcps", "/hub/skills", "/hub/twins", "/hub/wiki"]) {
    assert(sitemap.includes(canonicalPath(path)), `sitemap.xml omits ${path}.`);
  }
  for (const [path] of dynamicExamples) {
    assert(sitemap.includes(canonicalPath(path)), `sitemap.xml omits ${path}.`);
  }
  assert(!sitemap.includes("https://rosclaw.io/"), "sitemap.xml uses the redirecting non-www host.");
}

const robotsResponse = await request("/robots.txt");
if (robotsResponse) {
  const robots = await robotsResponse.text();
  assert(robotsResponse.status === 200, "robots.txt is unavailable.");
  assert(robots.includes(`Sitemap: ${canonicalPath("/sitemap.xml")}`), "robots.txt has the wrong sitemap host.");
}

if (errors.length) {
  console.error("Live site acceptance failed:");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `Live site acceptance passed: ${expectedPages.length} pages, ${mcpPackages.length} MCPs, ${skills.length} Skills, ${dynamicExamples.length} SSR details.`,
);
