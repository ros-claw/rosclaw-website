import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const modules = new Map();
function load(name) {
  const filename = path.resolve(`lib/registry/${name}.ts`);
  if (modules.has(filename)) return modules.get(filename).exports;
  const module = { exports: {} };
  modules.set(filename, module);
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function("exports", "module", "require", compiled)(module.exports, module, (dependency) => load(dependency.replace(/^\.\//, "")));
  return module.exports;
}

const { readAllRegistryRows, parseRegistryPage, registryPageUrl, registryPath } = load("pagination");
const { itemCategories, matchesRegistryCategory, sourceDescription, sourceGuidance, rankedRegistryItems } = load("discovery");
const { detailMetadata, detailStructuredData } = load("detail-seo");

// Reproduce the 1000-row cutoff, including a lower Supabase response cap.
for (const [size, cap] of [[0, 500], [500, 500], [1652, 500], [1652, 100]]) {
  const rows = Array.from({ length: size }, (_, id) => ({ id }));
  const ranges = [];
  const loaded = await readAllRegistryRows((from, to) => {
    ranges.push([from, to]);
    return Promise.resolve({ data: rows.slice(from, Math.min(to + 1, from + cap)), count: size, error: null });
  });
  assert.deepEqual(loaded, rows);
  assert.equal(new Set(loaded.map((row) => row.id)).size, size);
  if (size > 1000) assert.ok(ranges.length > 2);
}
await assert.rejects(() => readAllRegistryRows(() => Promise.resolve({ data: null, count: null, error: { message: "upstream failed" } })), /upstream failed/);
await assert.rejects(() => readAllRegistryRows(() => Promise.resolve({ data: [], count: 1652, error: null })), /incomplete catalog/);
await assert.rejects(() => readAllRegistryRows((from, to, signal) => new Promise((resolve, reject) => signal.addEventListener("abort", () => reject(signal.reason), { once: true })), 10), /timeout/);

assert.equal(parseRegistryPage("2"), 2);
for (const value of [undefined, "0", "-1", "2junk", "Infinity", "99999999999999999999", ["2", "3"]]) assert.equal(parseRegistryPage(value), 1);
assert.equal(registryPageUrl("/hub/skills", 1), "/hub/skills");
assert.equal(registryPageUrl("/hub/skills", 2), "/hub/skills?page=2");
assert.equal(registryPath("vendor/a skill"), "vendor/a%20skill");

const skill = { id: "one", name: "vendor/camera", displayName: "Camera Skill", authorName: "vendor", description: "Capture RealSense RGB-D images.", category: "Vision", robotTypes: ["universal"], tags: [], officialPublisher: false, githubRepoUrl: "https://github.com/vendor/skills/tree/main/skills/camera" };
assert.ok(matchesRegistryCategory(skill, "sensors-vision"));
assert.ok(!matchesRegistryCategory(skill, "other"));
assert.deepEqual(itemCategories({ ...skill, description: "Write newsletters", name: "vendor/newsletters", category: "Writing" }).map((x) => x.slug), ["other"]);
assert.deepEqual(rankedRegistryItems([{ ...skill, name: "vendor/b" }, { ...skill, name: "vendor/a" }]).map((x) => x.name), ["vendor/a", "vendor/b"]);
const document = "---\nname: example\n---\n# Package\n## Requirements\nPython 3.\n## Usage\n```bash\n# Not a heading\npython capture.py\n```\n## License\nMIT";
assert.deepEqual(sourceGuidance(document).map((s) => s.heading), ["Requirements", "Usage"]);
assert.ok(sourceGuidance(document)[1].text.includes("python capture.py"));
assert.equal(sourceGuidance("# Empty\nNo setup provided").length, 0);
assert.equal(sourceDescription("<b>Camera</b>\n  setup", "fallback"), "Camera setup");
assert.ok(sourceDescription("long ".repeat(100), "fallback").length <= 180);
assert.equal(detailMetadata("skills", "uuid-alias", skill).alternates.canonical, "/hub/skills/vendor/camera");
assert.equal(detailMetadata("skills", "missing", undefined).robots.index, false);
assert.equal(detailStructuredData("skills", skill)[1].mainEntity.codeRepository, skill.githubRepoUrl);
console.log("Registry SEO regression checks passed: complete pagination, failures, crawl URLs, taxonomy, source excerpts, and metadata.");
