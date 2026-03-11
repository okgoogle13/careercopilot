const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { runAudit } = require("../packages/design-audit/src/index");

test("copy audit flags user-facing meta language in screens", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "audit-copy-"));

  try {
    const screensDir = path.join(tempRoot, "apps", "web", "src", "screens");
    fs.mkdirSync(screensDir, { recursive: true });

    fs.writeFileSync(
      path.join(screensDir, "BadScreen.tsx"),
      `
        export function BadScreen() {
          return <div>Worker Portal migration placeholder with rollback path.</div>;
        }
      `,
      "utf8"
    );

    const report = runAudit({
      rootDir: tempRoot,
      mode: "copy",
    });

    assert.equal(report.summary.totalViolations > 0, true);
    assert.equal(
      report.results.some((result) =>
        result.violations.some((violation) => violation.ruleId === "no-user-facing-meta-language")
      ),
      true
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
