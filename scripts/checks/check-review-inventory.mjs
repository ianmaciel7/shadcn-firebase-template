import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const manifest = readFileSync(
  resolve(root, "docs/code-review/agents-manifest.md"),
  "utf8",
);
const rows = manifest
  .split("\n")
  .filter(
    (line) =>
      line.startsWith("| CODE_FILE |") || line.startsWith("| CODE_FOLDER |"),
  );
const excluded = (path) =>
  path.startsWith("docs/code-review/") ||
  path.startsWith("graphify-out/") ||
  path === "pnpm-lock.yaml" ||
  path === "functions/package-lock.json";
const files = execFileSync("git", ["ls-files", "-z"], {
  cwd: root,
  encoding: "utf8",
})
  .split("\0")
  .filter((path) => path && !excluded(path));
const expected = new Set(["./"]);
for (const file of files) {
  expected.add(file);
  let folder = dirname(file).replaceAll("\\", "/");
  while (folder !== "." && folder !== "/") {
    expected.add(`${folder}/`);
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
  if (!agent || !path) {
    throw new Error(`Malformed review row: ${row}`);
  }
  if (found.has(path) || agents.has(agent)) {
    throw new Error(`Duplicate inventory path or agent: ${path}`);
  }
  found.add(path);
  agents.add(agent);
  if (!expected.has(path)) {
    throw new Error(`Untracked or removed inventory path: ${path}`);
  }
  if (kind === "CODE_FOLDER" && path !== "./" && !path.endsWith("/")) {
    throw new Error(`Expected directory: ${path}`);
  }
  if (row.includes("| Completed |")) {
    completed++;
    const report = `docs/code-review/reports/${agent}.md`;
    if (!existsSync(resolve(root, report))) {
      throw new Error(`Missing completed report: ${report}`);
    }
  }
}
for (const path of expected) {
  if (!found.has(path)) {
    throw new Error(`Project item missing from inventory: ${path}`);
  }
}
const allRows = manifest.split("\n");
const docRows = allRows.filter(
  (line) =>
    line.startsWith("| DOC_FILE |") || line.startsWith("| DOC_FOLDER |"),
);
const coordinator = allRows.find((line) => line.startsWith("| COORDINATOR |"));
const activeReportAgents = new Set();
for (const row of [
  ...rows,
  ...docRows,
  ...(coordinator ? [coordinator] : []),
]) {
  const agent = row.split("|")[2]?.trim().replaceAll("`", "");
  if (!agent || activeReportAgents.has(agent)) {
    throw new Error(`Missing or duplicate review identity: ${agent}`);
  }
  activeReportAgents.add(agent);
  if (row.includes("| Completed |")) {
    const report = resolve(root, "docs/code-review/reports", `${agent}.md`);
    if (!existsSync(report)) {
      throw new Error(`Missing completed primary report: ${agent}`);
    }
  }
  if (row.startsWith("| DOC_")) {
    const source = row.split("](<../../")[1]?.split(">)")[0];
    if (!source || !existsSync(resolve(root, source))) {
      throw new Error(`Missing installed documentation source: ${source}`);
    }
  }
}
const reportsDir = resolve(root, "docs/code-review/reports");
for (const name of readdirSync(reportsDir)) {
  if (name.endsWith(".md") && !activeReportAgents.has(name.slice(0, -3))) {
    throw new Error(`Orphaned active review report: ${name}`);
  }
}
const completedDocumentation = docRows.filter((line) =>
  line.includes("| Completed |"),
).length;
const reviewedCount =
  completed +
  completedDocumentation +
  (coordinator?.includes("| Completed |") ? 1 : 0);
const overallCount = rows.length + docRows.length + (coordinator ? 1 : 0);
const summary = readFileSync(
  resolve(root, "docs/code-review/README.md"),
  "utf8",
);
function tableCount(label) {
  const line = summary
    .split("\n")
    .find((value) => value.startsWith(`| ${label} | `));
  if (!line) {
    throw new Error(`Missing summary metric: ${label}`);
  }
  const value = Number(line.split("|")[2].trim().replaceAll(",", ""));
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid summary metric: ${label}`);
  }
  return value;
}
for (const [label, expectedValue] of [
  [
    "Project folders",
    rows.filter((line) => line.startsWith("| CODE_FOLDER |")).length,
  ],
  [
    "Project files",
    rows.filter((line) => line.startsWith("| CODE_FILE |")).length,
  ],
  ["Expected agents / primary items", overallCount],
  ["Completed tasks", reviewedCount],
  ["Pending tasks (excluding active)", overallCount - reviewedCount],
]) {
  if (tableCount(label) !== expectedValue) {
    throw new Error(
      `Stale audit summary metric: ${label}; expected ${expectedValue}`,
    );
  }
}
console.log(
  `Review inventory matches ${expected.size} tracked project items; ${completed} completed.`,
);
