import assert from "node:assert/strict";

const site = process.env.ROSCLAW_SITE_URL || "https://www.rosclaw.io";
const canonical = "https://www.rosclaw.io";
const encodeName = (name) => name.split("/").map(encodeURIComponent).join("/");
const request = async (path) => fetch(new URL(path, site), { signal: AbortSignal.timeout(20000) });
const sitemapResponse = await request("/sitemap.xml");
assert.equal(sitemapResponse.status, 200, "Sitemap must be healthy");
const xml = await sitemapResponse.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replaceAll("&amp;", "&"));
assert.equal(new Set(urls).size, urls.length, "Sitemap contains duplicates");
const counts = {};
for (const [kind, api] of [["skills", "skills"], ["mcps", "mcp-packages"]]) {
  const response = await request(`/api/${api}`);
  assert.equal(response.status, 200);
  const rows = await response.json();
  assert.ok(Array.isArray(rows) && rows.length > 0);
  counts[kind] = rows.length;
  for (const item of rows) assert.ok(urls.includes(`${canonical}/hub/${kind}/${encodeName(item.name)}`), `Sitemap omits ${item.name}`);
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const upstream = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${kind === "skills" ? "skills" : "mcp_packages"}?select=id&status=eq.approved`, {
      method: "HEAD", headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, Prefer: "count=exact" }, signal: AbortSignal.timeout(20000),
    });
    const count = Number(upstream.headers.get("content-range")?.split("/")[1]);
    assert.equal(rows.length, count, `${kind} API is truncated`);
  }
  const lastPage = Math.ceil(rows.length / 24);
  for (const page of new Set([1, 2, lastPage])) {
    const path = `/hub/${kind}${page === 1 ? "" : `?page=${page}`}`;
    const r = await request(path);
    assert.equal(r.status, 200, path);
    const html = await r.text();
    assert.ok(html.includes(`rel="canonical" href="${canonical}${path}"`), `${path} canonical mismatch`);
    assert.ok(html.includes('aria-label="Registry pagination"'), `${path} lacks crawlable pagination`);
    const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m) => m[1].replaceAll("&amp;", "&"));
    if (page < lastPage) assert.ok(links.includes(`/hub/${kind}?page=${page + 1}`), `${path} lacks next link`);
    assert.ok(links.some((link) => link.startsWith(`/hub/${kind}/category/`)), `${path} lacks collection links`);
  }
  const categoryUrl = urls.find((url) => url.includes(`/hub/${kind}/category/`) && !url.includes("?"));
  assert.ok(categoryUrl);
  const categoryPath = new URL(categoryUrl).pathname;
  const categoryResponse = await request(categoryPath);
  assert.equal(categoryResponse.status, 200);
  const categoryHtml = await categoryResponse.text();
  assert.ok(categoryHtml.includes(`rel="canonical" href="${categoryUrl}"`));
  assert.ok(categoryHtml.includes('"@type":"CollectionPage"'));
  assert.equal((await request(`/hub/${kind}/category/not-a-category`)).status, 404);
  assert.equal((await request(`/hub/${kind}?page=999999`)).status, 404);
}
for (const [kind, name] of [["mcps", "ros-claw/realsense-ros-mcp"], ["skills", "ros-claw/realsense_ops"]]) {
  const path = `/hub/${kind}/${encodeName(name)}`;
  const r = await request(path);
  assert.equal(r.status, 200);
  const html = await r.text();
  assert.ok(html.includes("Plan your integration"));
  assert.ok(html.includes('"@type":"SoftwareSourceCode"'));
  assert.ok(html.includes('"@type":"BreadcrumbList"'));
  assert.ok(html.includes(`href="/hub/${kind}/category/`));
  assert.ok(html.includes("Explore related packages"));
  if (kind === "skills") assert.ok(html.includes('href="https://github.com/ros-claw/skills/tree/main/skills/realsense_ops"'));
}
console.log(`Registry SEO live acceptance passed: ${counts.skills} Skills, ${counts.mcps} MCPs, ${urls.length} sitemap URLs, pagination, collections, and source-linked details.`);
