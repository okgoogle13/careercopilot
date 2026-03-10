const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const {
  createScreenSource,
  generateScreen,
  toPascalCase,
  validateScreenName,
} = require("./migrate-screen-lib");

const TEMPLATE_SOURCE = `import { March } from '../components/ui/March';
import { Placard } from '../components/ui/Placard';
import { Strike } from '../components/ui/Strike';

export function LoginScreen() {
  return <Placard title="Worker Portal Login"><March /></Placard>;
}
`;

function createFixtureRoot() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "migration-kit-"));
  fs.mkdirSync(path.join(rootDir, "apps", "web", "src", "screens"), { recursive: true });
  fs.writeFileSync(
    path.join(rootDir, "apps", "web", "src", "screens", "LoginScreen.tsx"),
    TEMPLATE_SOURCE,
    "utf8"
  );
  return rootDir;
}

test("toPascalCase converts kebab-case route names", () => {
  assert.equal(toPascalCase("job-board"), "JobBoard");
  assert.equal(toPascalCase("dashboard"), "Dashboard");
});

test("validateScreenName rejects invalid values", () => {
  assert.throws(() => validateScreenName(""), /Usage:/);
  assert.throws(() => validateScreenName("Dashboard!"), /kebab-case/);
});

test("createScreenSource produces a neutral generated screen scaffold", () => {
  const source = createScreenSource("job-board", TEMPLATE_SOURCE);
  assert.match(source, /export function JobBoardScreen/);
  assert.match(source, /title="Job Board Screen"/);
  assert.match(source, /data-testid="job-board-screen"/);
  assert.match(source, /import \{ March \} from '\.\.\/components\/ui\/March';/);
  assert.match(source, /import \{ Placard \} from '\.\.\/components\/ui\/Placard';/);
  assert.match(source, /import \{ Strike \} from '\.\.\/components\/ui\/Strike';/);
  assert.match(source, /Semantic tokens only\./);
  assert.doesNotMatch(source, /Worker Portal Login/);
  assert.doesNotMatch(source, /export function LoginScreen/);
  assert.doesNotMatch(source, /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})/);
  assert.doesNotMatch(source, /\brgb(a)?\(/);
  assert.doesNotMatch(source, /\bhsl(a)?\(/);
  assert.doesNotMatch(source, /\bpebbleSurge01\b/i);
  assert.doesNotMatch(source, /\bscaffoldSlab01\b/i);
  assert.doesNotMatch(source, /\b(?:Seed|Leaf|Jar|Cabinet)\b/);
});

test("generateScreen writes a new screen file and refuses overwrite", () => {
  const rootDir = createFixtureRoot();
  const firstRun = generateScreen(rootDir, "profile");

  assert.ok(fs.existsSync(firstRun.targetPath));
  const generatedSource = fs.readFileSync(firstRun.targetPath, "utf8");
  assert.match(generatedSource, /Profile Screen/);

  assert.throws(() => generateScreen(rootDir, "profile"), /already exists/);
});

test("generateScreen refuses to overwrite an existing dashboard screen", () => {
  const rootDir = createFixtureRoot();
  const dashboardPath = path.join(
    rootDir,
    "apps",
    "web",
    "src",
    "screens",
    "DashboardScreen.tsx"
  );

  fs.writeFileSync(
    dashboardPath,
    "export function DashboardScreen() { return null; }\n",
    "utf8"
  );

  assert.throws(() => generateScreen(rootDir, "dashboard"), /already exists/);
});
