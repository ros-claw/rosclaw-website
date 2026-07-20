import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coreRoot = path.resolve(
  process.env.ROSCLAW_CORE_ROOT ??
    path.join(repositoryRoot, "..", "rosclaw", "rosclaw-v1.0"),
);
const exporter = path.join(coreRoot, "scripts", "product", "export_status.py");
const output = path.join(repositoryRoot, "content", "product-status.json");
const venvPython = path.join(coreRoot, ".venv", "bin", "python");
const python = process.env.PYTHON ?? (existsSync(venvPython) ? venvPython : "python3");

if (!existsSync(exporter)) {
  throw new Error(`ROSClaw status exporter not found: ${exporter}`);
}

const result = spawnSync(python, [exporter, "--output", output], {
  cwd: coreRoot,
  encoding: "utf8",
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`Synced ${output} from ${exporter}`);
