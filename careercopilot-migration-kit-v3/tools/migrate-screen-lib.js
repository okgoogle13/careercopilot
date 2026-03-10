const fs = require("node:fs");
const path = require("node:path");

const TEMPLATE_RELATIVE_PATH = path.join("apps", "web", "src", "screens", "LoginScreen.tsx");
const TARGET_DIRECTORY_RELATIVE_PATH = path.join("apps", "web", "src", "screens");
const NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

function toPascalCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function validateScreenName(screenName) {
  if (!screenName) {
    throw new Error("Usage: npm run migrate:screen -- <screen-name>");
  }

  if (!NAME_PATTERN.test(screenName)) {
    throw new Error("Screen name must be lowercase kebab-case or a simple lowercase route id.");
  }
}

function assertTemplateCompatibility(templateSource) {
  const requiredMarkers = [
    "export function LoginScreen",
    "Worker Portal Login",
    "Strike",
    "Placard",
    "March",
  ];

  for (const marker of requiredMarkers) {
    if (!templateSource.includes(marker)) {
      throw new Error(`LoginScreen template is missing required marker: ${marker}`);
    }
  }
}

function createScreenSource(screenName, templateSource) {
  assertTemplateCompatibility(templateSource);

  const pascalName = toPascalCase(screenName);
  const title = screenName
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

  return `import { March } from '../components/ui/March';
import { Placard } from '../components/ui/Placard';
import { Strike } from '../components/ui/Strike';

export function ${pascalName}Screen() {
  return (
    <section
      className="placeholder-screen"
      data-testid="${screenName}-screen"
    >
      <Strike eyebrow="Generated Screen">
        This screen was generated from the LoginScreen migration pattern.
      </Strike>
      <Placard title="${title} Screen">
        <March>Semantic tokens only. Legacy fallback stays available until the flag flips.</March>
        <p className="status-copy">
          Generated placeholder for the /${screenName} route. Connect feature-specific content in the next migration pass.
        </p>
      </Placard>
    </section>
  );
}
`;
}

function getPaths(rootDir, screenName) {
  return {
    templatePath: path.join(rootDir, TEMPLATE_RELATIVE_PATH),
    targetPath: path.join(
      rootDir,
      TARGET_DIRECTORY_RELATIVE_PATH,
      `${toPascalCase(screenName)}Screen.tsx`
    ),
  };
}

function generateScreen(rootDir, screenName) {
  validateScreenName(screenName);
  const { templatePath, targetPath } = getPaths(rootDir, screenName);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing LoginScreen template: ${templatePath}`);
  }

  if (fs.existsSync(targetPath)) {
    throw new Error(`Target screen already exists: ${targetPath}`);
  }

  const templateSource = fs.readFileSync(templatePath, "utf8");
  const generatedSource = createScreenSource(screenName, templateSource);

  fs.writeFileSync(targetPath, generatedSource, "utf8");

  return {
    screenName,
    targetPath,
  };
}

module.exports = {
  TEMPLATE_RELATIVE_PATH,
  TARGET_DIRECTORY_RELATIVE_PATH,
  createScreenSource,
  generateScreen,
  toPascalCase,
  validateScreenName,
};
