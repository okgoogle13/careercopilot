const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { pathToFileURL } = require("node:url");

async function loadRunAudit() {
  const modulePath = pathToFileURL(
    path.resolve(__dirname, "../packages/design-audit/src/index.ts")
  ).href;
  const mod = await import(modulePath);
  return mod.runAudit;
}

function createLegacyFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "legacy-audit-"));
  const appDir = path.join(rootDir, "apps", "web", "src");
  fs.mkdirSync(appDir, { recursive: true });
  fs.writeFileSync(
    path.join(appDir, "LegacySample.tsx"),
    "export const font = 'Inter'; export const color = '#1A1714'; export const shape = 'pebbleSurge01';\n",
    "utf8"
  );
  return rootDir;
}

test("legacy audit flags legacy migration patterns", async () => {
  const runAudit = await loadRunAudit();
  const rootDir = createLegacyFixture();
  const report = runAudit({
    rootDir,
    includeGlobs: ["apps/web/src/**/*.{ts,tsx,js,jsx}"],
    excludeGlobs: [],
    boundaryCheck: false,
    mode: "legacy",
  });

  assert.equal(report.summary.filesWithViolations, 1);
  assert.equal(report.summary.totalViolations, 3);
  assert.match(JSON.stringify(report.results[0].violations), /no-legacy-migration-patterns/);
});
