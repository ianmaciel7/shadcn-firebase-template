import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const manifest = readFileSync(resolve(root, "docs/code-review/agents-manifest.md"), "utf8");
const rows = manifest.split("\n").filter((line) =>
  line.startsWith("| CODE_FILE |") || line.startsWith("| CODE_FOLDER |"),
);
const excluded = (path) =>
  path.startsWith("docs/code-review/") ||
  path.startsWith("graphify-out/") ||
  path === "pnpm-lock.yaml" ||
  path === "functions/package-lock.json";
const files = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" })
  .split("\0")
  .filter((path) => path && !excluded(path));
const expected = new Set(["./"]);
for (const file of files) {
  expected.add(file);
  let folder = dirname(file).replaceAll("\\", "/");
  while (folder !== "." && folder !== "/") {
    expected.add(folder + "/");
    folder = dirname(folder).replaceAll("\\", "/");
  }
}
const found = new Set();
const agents = new Set();
let completed = 0;
for (const row of rows) {
  const kind = row.startsWith("| CODE_FOLDER |") ? "CODE_FOLDER" : "CODE_FILE";
  const cells = row.split("|");
  const agent = cells[2]?.trim().replaceAll(String.fromCharCode(96), "");
  const path = row.split("](<../../")[1]?.split(">)")[0];
  if (!agent || !path) throw new Error("Malformed review row: " + row);
  if (found.has(path) || agents.has(agent)) throw new Error("Duplicate inventory path or agent: " + path);
  found.add(path);
  agents.add(agent);
  if (!expected.has(path)) throw new Error("Untracked or removed inventory path: " + path);
  if (kind === "CODE_FOLDER" && path !== "./" && !path.endsWith("/")) throw new Error("Expected directory: " + path);
  if (row.includes("| Completed |")) {
    completed++;
    const report = "docs/code-review/reports/" + agent + ".md";
    if (!existsSync(resolve(root, report))) throw new Error("Missing completed report: " + report);
  }
}
for (const path of expected) {
  if (!found.has(path)) throw new Error("Project item missing from inventory: " + path);
}
console.log("Review inventory matches " + expected.size + " tracked project items; " + completed + " completed.");
