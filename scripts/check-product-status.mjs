import {
  createHash,
} from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const snapshotPath = path.join(repositoryRoot, "content", "product-status.json");
const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
const errors = [];

const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

assert(
  snapshot.generated?.schema_version === "rosclaw.product_status_snapshot.v1",
  "Unexpected product status snapshot schema.",
);
assert(
  snapshot.status?.schema_version === "rosclaw.product_status.v1",
  "Unexpected product status schema.",
);
assert(
  typeof snapshot.status?.release?.version === "string" &&
    snapshot.status.release.version.length > 0,
  "Release version is missing.",
);
assert(
  snapshot.status?.release?.maturity === "alpha",
  "Website release maturity must match canonical alpha status.",
);

const paths = snapshot.status?.golden_paths ?? {};
assert(
  paths.ur5e_reach?.dimensions?.simulation === "verified",
  "UR5e simulation must remain verified.",
);
assert(
  paths.rh56_single_step?.dimensions?.hardware_actuation === "developer_observed",
  "RH56 actuation must remain developer_observed until independent validation.",
);
assert(
  paths.rh56_single_step?.agent_ready === false,
  "RH56 must not be Agent Ready before black-box acceptance.",
);
assert(
  paths.realsense_inspect?.dimensions?.hardware_read !== "verified",
  "RealSense hardware read is not yet independently verified.",
);

for (const [name, entry] of Object.entries(paths)) {
  const evidenceRecords = entry.evidence ?? [];
  for (const evidence of evidenceRecords) {
    assert(Boolean(evidence.id), `${name} contains evidence without an ID.`);
    assert(Boolean(evidence.path), `${name} contains evidence without a path.`);
    if (evidence.fixture === true) {
      assert(
        evidence.observation_scope !== "physical_hardware",
        `${name} fixture evidence cannot claim physical hardware observation.`,
      );
    }
  }
  if (entry.dimensions?.simulation === "verified") {
    assert(
      evidenceRecords.some(
        (evidence) =>
          evidence.fixture !== true &&
          evidence.observation_scope === "physics_simulation",
      ),
      `${name} simulation verification has no physics evidence.`,
    );
  }
  if (
    entry.dimensions?.hardware_read === "verified" ||
    entry.dimensions?.hardware_actuation === "verified"
  ) {
    assert(
      evidenceRecords.some(
        (evidence) =>
          evidence.fixture !== true &&
          evidence.independent === true &&
          evidence.observation_scope === "physical_hardware",
      ),
      `${name} hardware verification has no independent physical evidence.`,
    );
  }
  if (entry.dimensions?.agent_blackbox === "verified") {
    assert(
      evidenceRecords.some(
        (evidence) =>
          evidence.fixture !== true &&
          evidence.independent === true &&
          [
            "external_agent_simulation",
            "external_agent_hardware",
          ].includes(evidence.observation_scope),
      ),
      `${name} Agent verification has no independent external-Agent evidence.`,
    );
  }
}

const coreRoot = path.resolve(
  process.env.ROSCLAW_CORE_ROOT ??
    path.join(repositoryRoot, "..", "rosclaw", "rosclaw-v1.0"),
);
const statusSource = path.join(coreRoot, "src", "rosclaw", "product", "status.yaml");
if (existsSync(statusSource)) {
  const digest = createHash("sha256").update(readFileSync(statusSource)).digest("hex");
  assert(
    digest === snapshot.generated.source_sha256,
    "Website status snapshot is stale. Run `npm run status:sync`.",
  );
  for (const [name, entry] of Object.entries(paths)) {
    for (const evidence of entry.evidence ?? []) {
      assert(
        existsSync(path.join(coreRoot, evidence.path)),
        `${name} evidence path does not exist in the core repository: ${evidence.path}`,
      );
    }
  }
}

for (const route of [
  "app/start/page.tsx",
  "app/robots/page.tsx",
  "app/apps/page.tsx",
  "app/evidence/page.tsx",
  "app/status/page.tsx",
  "app/hub/mcps/page.tsx",
  "app/hub/skills/page.tsx",
]) {
  assert(existsSync(path.join(repositoryRoot, route)), `Required product route is missing: ${route}`);
}

for (const stalePublicFile of ["public/robots.txt", "public/sitemap.xml"]) {
  assert(
    !existsSync(path.join(repositoryRoot, stalePublicFile)),
    `${stalePublicFile} must not shadow the App Router metadata route.`,
  );
}

for (const route of ["app/hub/mcps/page.tsx", "app/hub/skills/page.tsx"]) {
  const source = readFileSync(path.join(repositoryRoot, route), "utf8");
  assert(!source.includes('"use client"'), `${route} must remain server-rendered.`);
  assert(source.includes("initialLoadError"), `${route} must pass server-loaded registry data.`);
}

const rootLayoutSource = readFileSync(
  path.join(repositoryRoot, "app", "layout.tsx"),
  "utf8",
);
assert(
  rootLayoutSource.includes('metadataBase: new URL("https://www.rosclaw.io")'),
  "The metadata base must use the canonical www host.",
);
assert(
  !rootLayoutSource.includes("alternates:"),
  "The root layout must not force every route to use the home-page canonical.",
);

const sitemapSource = readFileSync(
  path.join(repositoryRoot, "app", "sitemap.ts"),
  "utf8",
);
for (const path of ["/robots", "/apps", "/evidence", "/status", "/hub/mcps", "/hub/skills", "/hub/twins", "/hub/wiki"]) {
  assert(sitemapSource.includes(`[\"${path}\"`), `The dynamic sitemap omits ${path}.`);
}

const nextConfigSource = readFileSync(
  path.join(repositoryRoot, "next.config.mjs"),
  "utf8",
);
for (const header of [
  "Content-Security-Policy",
  "Permissions-Policy",
  "Referrer-Policy",
  "X-Content-Type-Options",
  "X-Frame-Options",
]) {
  assert(nextConfigSource.includes(header), `Security response header is missing: ${header}.`);
}

for (const client of [
  "components/hub/mcp-registry-client.tsx",
  "components/hub/skill-registry-client.tsx",
]) {
  const source = readFileSync(path.join(repositoryRoot, client), "utf8");
  assert(!source.includes('fetch("/api/'), `${client} must not replace SSR data with a mount-time request.`);
}

const catalogSource = readFileSync(
  path.join(repositoryRoot, "content", "product-catalog.ts"),
  "utf8",
);
function catalogEntry(slug) {
  const marker = `slug: "${slug}"`;
  const start = catalogSource.indexOf(marker);
  if (start < 0) return "";
  const next = catalogSource.indexOf("\n  {\n    slug:", start + marker.length);
  return catalogSource.slice(start, next < 0 ? catalogSource.length : next);
}
assert(
  !catalogEntry("rh56-rps").includes("hardwareObserved: true"),
  "RH56 RPS must not inherit hardware evidence from a different execution path.",
);
assert(
  !catalogEntry("guarded-motion").includes("simulationVerified: true"),
  "A planned App must not inherit simulation evidence from an underlying controller.",
);

const forbidden = [
  [/v0\.8\.2/g, "stale v0.8.2 release"],
  [/\bsim_g1\b/g, "unverified sim_g1 path"],
  [/Decision:\s*ALLOW_WITH_LIMITS/g, "fabricated ALLOW_WITH_LIMITS terminal output"],
  [/Ready today/gi, "ambiguous Ready today status"],
  [/\/#robots\b/g, "obsolete Robots anchor"],
  [/ROSClaw v1\.0\.0/g, "hard-coded stale installer version"],
  [
    /authorName\s*===\s*["']ros-claw["']/g,
    "publisher-name inference presented as verification",
  ],
  [
    /startsWith\(["']ros-claw\//g,
    "package-name inference presented as verification",
  ],
  [
    /is_verified\s*:\s*true/g,
    "publication approval coupled to verification",
  ],
  [/Verified publishers/g, "publisher identity conflated with package verification"],
  [/Registry verified/gi, "ambiguous registry verification badge"],
];

const sourceFiles = [];
for (const root of ["app", "components", "content"]) {
  const pending = [path.join(repositoryRoot, root)];
  while (pending.length) {
    const current = pending.pop();
    if (!current) continue;
    for (const name of readdirSync(current)) {
      const candidate = path.join(current, name);
      if (statSync(candidate).isDirectory()) {
        pending.push(candidate);
      } else if (/\.(?:ts|tsx|json)$/.test(name)) {
        sourceFiles.push(candidate);
      }
    }
  }
}

for (const file of sourceFiles) {
  const text = readFileSync(file, "utf8");
  for (const [pattern, label] of forbidden) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      errors.push(`${path.relative(repositoryRoot, file)} contains ${label}.`);
    }
  }
}

const installerSource = readFileSync(
  path.join(repositoryRoot, "app", "get", "route.ts"),
  "utf8",
);
assert(
  installerSource.includes('[ -e "$WRAPPER_PATH" ] || [ -L "$WRAPPER_PATH" ]'),
  "Installer must refuse to overwrite an existing CLI wrapper.",
);
assert(
  installerSource.includes('disk_path="$INSTALL_ROOT"'),
  "Installer disk check must follow the selected install root.",
);
assert(
  installerSource.includes('rm -f "$WRAPPER_PATH"'),
  "Installer must clean up a wrapper created by a failed install.",
);

if (errors.length) {
  console.error("Product status contract failed:");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `Product status contract passed for v${snapshot.status.release.version} ${snapshot.status.release.maturity}.`,
);
