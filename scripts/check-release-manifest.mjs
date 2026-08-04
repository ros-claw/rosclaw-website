import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  readFileSync(path.join(root, "content/release-manifest.json"), "utf8"),
);
const installer = readFileSync(path.join(root, "app/get/route.ts"), "utf8");
const errors = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};
const fullSha = /^[0-9a-f]{40}$/;

assert(
  manifest.schema_version === "rosclaw.website_release_manifest.v1",
  "Unexpected release manifest schema.",
);
for (const channel of ["stable", "main"]) {
  const entry = manifest[channel];
  assert(entry && fullSha.test(entry.commit), `${channel} must pin a full commit SHA.`);
  assert(entry?.install_strategy === "verified-git-commit", `${channel} install strategy must verify a commit.`);
  assert(Array.isArray(entry?.python) && entry.python.length > 0, `${channel} Python support is missing.`);
}
assert(manifest.stable.commit !== manifest.main.commit, "Stable and Main snapshots must be explicit and distinct.");
assert(!installer.includes("--branch main"), "Stable installer must never clone a floating main branch.");
assert(installer.includes("rev-parse HEAD"), "Installer must verify the checked-out commit.");
assert(installer.includes("--channel stable|main"), "Installer must document both release channels.");

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}
console.log("Release manifest and installers are pinned and internally consistent.");
