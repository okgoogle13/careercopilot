const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { runAudit } = require("../packages/design-audit/src/index");

/**
 * Helper to create temp screen file for testing copy audit rules
 */
function createTestScreen(tempRoot, filename, content) {
  const screensDir = path.join(tempRoot, "apps", "web", "src", "screens");
  fs.mkdirSync(screensDir, { recursive: true });
  fs.writeFileSync(path.join(screensDir, filename), content, "utf8");
}

// BR-COPY-001: Banned Administrative/Bureaucratic Terms
test("BR-COPY-001: flags Worker Portal and bureaucratic terms", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "audit-copy-"));
  try {
    createTestScreen(
      tempRoot,
      "TestScreen.tsx",
      `
      export function TestScreen() {
        return (
          <section>
            <h1>Worker Portal Access</h1>
            <p>Enter the workplace via the Worker Access portal.</p>
          </section>
        );
      }
    `
    );
    const report = runAudit({ rootDir: tempRoot, mode: "copy" });
    assert.equal(report.summary.totalViolations > 0, true, "Should detect Worker Portal violations");
    assert.ok(
      report.results.some((r) => r.violations.some((v) => v.message.includes("Bureaucratic"))),
      "Violation message should mention bureaucratic terms"
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

// BR-COPY-002: Developer Meta-Language (CRITICAL)
test("BR-COPY-002: flags migration and feature flag meta-language", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "audit-copy-"));
  try {
    createTestScreen(
      tempRoot,
      "TestScreen.tsx",
      `
      export function TestScreen() {
        return (
          <section>
            <p>This migration rollback fallback is available via the feature flag.</p>
            <p>The placeholder legacy route will remain active.</p>
          </section>
        );
      }
    `
    );
    const report = runAudit({ rootDir: tempRoot, mode: "copy" });
    assert.equal(report.summary.totalViolations > 0, true, "Should detect meta-language violations");
    assert.ok(
      report.results.some((r) => r.violations.some((v) => v.message.includes("meta-language"))),
      "Violation message should mention meta-language"
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

// BR-COPY-002 variant: Placeholder workflow language
test("BR-COPY-002 variant: flags 'checkpoint cleared' placeholder language", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "audit-copy-"));
  try {
    createTestScreen(
      tempRoot,
      "TestScreen.tsx",
      `
      export function TestScreen() {
        const message = "Access checkpoint cleared. Workspace handoff acknowledged.";
        return <p>{message}</p>;
      }
    `
    );
    const report = runAudit({ rootDir: tempRoot, mode: "copy" });
    assert.equal(report.summary.totalViolations > 0, true, "Should detect checkpoint cleared language");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

// Regression Protection: All 3 production screens must pass
test("regression: LoginScreen passes all copy rules", () => {
  const kitRoot = path.resolve(__dirname, "..");
  const report = runAudit({ rootDir: kitRoot, mode: "copy" });

  const loginViolations = report.results
    .filter((r) => r.filePath.includes("LoginScreen.tsx"))
    .flatMap((r) => r.violations);

  assert.equal(
    loginViolations.length,
    0,
    `LoginScreen should have 0 violations, found: ${JSON.stringify(loginViolations, null, 2)}`
  );
});

test("regression: RegisterScreen passes all copy rules", () => {
  const kitRoot = path.resolve(__dirname, "..");
  const report = runAudit({ rootDir: kitRoot, mode: "copy" });

  const registerViolations = report.results
    .filter((r) => r.filePath.includes("RegisterScreen.tsx"))
    .flatMap((r) => r.violations);

  assert.equal(
    registerViolations.length,
    0,
    `RegisterScreen should have 0 violations, found: ${JSON.stringify(registerViolations, null, 2)}`
  );
});

test("regression: DashboardScreen passes all copy rules", () => {
  const kitRoot = path.resolve(__dirname, "..");
  const report = runAudit({ rootDir: kitRoot, mode: "copy" });

  const dashboardViolations = report.results
    .filter((r) => r.filePath.includes("DashboardScreen.tsx"))
    .flatMap((r) => r.violations);

  assert.equal(
    dashboardViolations.length,
    0,
    `DashboardScreen should have 0 violations, found: ${JSON.stringify(dashboardViolations, null, 2)}`
  );
});

// Test that legacy files are correctly excluded
test("copy audit excludes legacy feature files", () => {
  const kitRoot = path.resolve(__dirname, "..");
  const report = runAudit({ rootDir: kitRoot, mode: "copy" });

  const legacyScanned = report.results.filter((r) => r.filePath.includes("Legacy.tsx") && r.scanned);

  assert.equal(legacyScanned.length, 0, "Legacy files should not be scanned for copy violations");
});

// Regression: migrated ProfileScreen is scanned and remains clean
test("regression: ProfileScreen passes all copy rules", () => {
  const kitRoot = path.resolve(__dirname, "..");
  const report = runAudit({ rootDir: kitRoot, mode: "copy" });

  const profileResults = report.results.filter(
    (r) => r.filePath.includes("ProfileScreen.tsx") && r.scanned
  );
  const profileViolations = profileResults.flatMap((r) => r.violations);

  assert.equal(profileResults.length, 1, "ProfileScreen should be scanned by copy audit");
  assert.equal(
    profileViolations.length,
    0,
    `ProfileScreen should have 0 violations, found: ${JSON.stringify(profileViolations, null, 2)}`
  );
});

// Test audit mode coverage
test("audit modes: copy mode only scans screens directory", () => {
  const kitRoot = path.resolve(__dirname, "..");
  const report = runAudit({ rootDir: kitRoot, mode: "copy" });

  const scannedFiles = report.results.filter((r) => r.scanned);

  assert.ok(
    scannedFiles.every((r) => r.filePath.includes(path.join("screens", ""))),
    "Copy mode should only scan files in screens/ directory"
  );
});

// Test that clean screens produce 0 violations report
test("clean screens: verify audit report shows 0 total violations", () => {
  const kitRoot = path.resolve(__dirname, "..");
  const report = runAudit({ rootDir: kitRoot, mode: "copy" });

  assert.equal(
    report.summary.totalViolations,
    0,
    `Expected 0 total violations, found: ${report.summary.totalViolations}`
  );
  assert.equal(
    report.summary.filesWithViolations,
    0,
    `Expected 0 files with violations, found: ${report.summary.filesWithViolations}`
  );
});
