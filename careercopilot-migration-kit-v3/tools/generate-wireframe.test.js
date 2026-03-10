const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const {
  createWireframeDocument,
  generateWireframe,
  validateWireframeName,
} = require("./generate-wireframe-lib");

const SCREEN_SOURCE = `import { March } from '../components/ui/March';
import { Placard } from '../components/ui/Placard';
import { Strike } from '../components/ui/Strike';

export function LoginScreen() {
  return (
    <section
      className="login-panel"
      data-testid="login-screen"
    >
      <Strike eyebrow="Migrated Screen">
        Placeholder copy.
      </Strike>
      <Placard title="Worker Portal Login">
        <March>Semantic tokens only.</March>
        <button
          className="secondary-action"
          type="button"
          onClick={() => navigate('/register')}
        >
          Create Account
        </button>
      </Placard>
    </section>
  );
}
`;

function createFixtureRoot() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "wireframe-kit-"));
  fs.mkdirSync(path.join(rootDir, "apps", "web", "src", "screens"), { recursive: true });
  fs.writeFileSync(
    path.join(rootDir, "apps", "web", "src", "screens", "LoginScreen.tsx"),
    SCREEN_SOURCE,
    "utf8"
  );
  return rootDir;
}

test("validateWireframeName rejects invalid values", () => {
  assert.throws(() => validateWireframeName(""), /Usage:/);
  assert.throws(() => validateWireframeName("Profile!"), /kebab-case/);
});

test("createWireframeDocument extracts stable metadata from a screen", () => {
  const document = createWireframeDocument(
    "login",
    SCREEN_SOURCE,
    path.join("apps", "web", "src", "screens", "LoginScreen.tsx")
  );

  assert.equal(document.route, "/login");
  assert.equal(document.screenName, "LoginScreen");
  assert.equal(document.title, "Worker Portal Login");
  assert.deepEqual(document.layout.components, ["March", "Placard", "Strike"]);
  assert.deepEqual(document.layout.testIds, ["login-screen"]);
  assert.match(document.notes.join(" "), /register-navigation/);
});

test("generateWireframe writes a wireframe json artifact", () => {
  const rootDir = createFixtureRoot();
  const result = generateWireframe(rootDir, "login");

  assert.ok(fs.existsSync(result.outputPath));
  const document = JSON.parse(fs.readFileSync(result.outputPath, "utf8"));
  assert.equal(document.route, "/login");
  assert.equal(document.layout.archetype, "Slab");
  assert.deepEqual(document.tokenPolicy.allowedPrefixes, [
    "--sys-color-",
    "--sys-shape-",
    "--sys-type-",
  ]);
});
