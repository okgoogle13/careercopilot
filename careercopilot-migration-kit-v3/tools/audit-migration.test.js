const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { pathToFileURL } = require("node:url");

async function loadMigrationAudit() {
  const modulePath = pathToFileURL(
    path.resolve(__dirname, "../packages/design-audit/src/migrationAudit.ts")
  ).href;
  return import(modulePath);
}

function createFixtureRoot() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "migration-audit-"));
  fs.mkdirSync(path.join(rootDir, "apps", "web", "src", "screens"), { recursive: true });
  fs.mkdirSync(path.join(rootDir, "docs", "design-system", "wireframes"), { recursive: true });
  fs.mkdirSync(
    path.join(rootDir, "docs", "design-system", "benchmarks", "fixture-benchmark-v1"),
    { recursive: true }
  );
  fs.mkdirSync(path.join(rootDir, "frontend", "docs", "design", "generated", "previews", "run-fixture"), {
    recursive: true,
  });

  fs.writeFileSync(
    path.join(rootDir, "apps", "web", "src", "screens", "FixtureScreen.tsx"),
    "export function FixtureScreen() { return <section><h1>Fixture Route View</h1></section>; }\n",
    "utf8"
  );
  fs.writeFileSync(
    path.join(rootDir, "docs", "design-system", "wireframes", "fixture.json"),
    JSON.stringify({ route: "/fixture" }, null, 2),
    "utf8"
  );
  fs.writeFileSync(
    path.join(rootDir, "docs", "design-system", "benchmarks", "fixture-benchmark-v1", "benchmark.json"),
    JSON.stringify(
      {
        benchmarkId: "fixture-benchmark-v1",
        benchmarkClass: "fixture_screen",
        route: "/fixture",
        sourceFile: "apps/web/src/screens/FixtureScreen.tsx",
        wireframeArtifact: "docs/design-system/wireframes/fixture.json",
        screenshots: [
          "frontend/docs/design/generated/previews/run-fixture/fixture.png",
        ],
        expectedScore: {
          overallMin: 90,
          dimensionFloors: {
            typography: 10,
            shapes: 10,
            colour: 10,
            motion: 6,
            m3_expressive: 10,
            asset_usage: 12,
            proportions: 8,
            anti_slop: 6,
            ux_copy: 8,
          },
        },
        notes: ["Fixture benchmark note"],
      },
      null,
      2
    ),
    "utf8"
  );
  fs.writeFileSync(
    path.join(rootDir, "docs", "design-system", "benchmarks", "fixture-benchmark-v1", "rationale.md"),
    "# Fixture Benchmark\n\n- rationale\n",
    "utf8"
  );

  return rootDir;
}

test("resolveBenchmark resolves route benchmarks from the repo", async () => {
  const { resolveBenchmark } = await loadMigrationAudit();
  const kitRoot = path.resolve(__dirname, "..");
  const { benchmark } = resolveBenchmark(kitRoot, "/profile");

  assert.equal(benchmark.benchmarkId, "profile-benchmark-v1");
  assert.equal(benchmark.route, "/profile");
});

test("runMigrationAudit returns needs_refinement when screenshot evidence is missing", async () => {
  const { runMigrationAudit } = await loadMigrationAudit();
  const rootDir = createFixtureRoot();

  try {
    const result = runMigrationAudit({
      rootDir,
      route: "/fixture",
      structuralAudits: {},
    });

    assert.equal(result.migration_visual_audit.status, "needs_refinement");
    assert.match(
      result.migration_visual_audit.below_benchmark_reasons.join("\n"),
      /Missing screenshot evidence/
    );
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
});

test("runMigrationAudit produces a pass report for /profile with local evidence", async () => {
  const { runMigrationAudit } = await loadMigrationAudit();
  const kitRoot = path.resolve(__dirname, "..");
  const result = runMigrationAudit({
    rootDir: kitRoot,
    route: "/profile",
  });

  assert.equal(result.migration_visual_audit.status, "pass");
  assert.equal(result.migration_visual_audit.score, 90);
  assert.equal(result.migration_visual_audit.benchmark_id, "profile-benchmark-v1");
  assert.equal(result.migration_visual_audit.dimension_scores.ux_copy, 8);
  assert.equal(result.migration_visual_audit.summary.high, 0);
});
