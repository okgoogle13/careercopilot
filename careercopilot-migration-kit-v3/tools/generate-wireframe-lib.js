const fs = require("node:fs");
const path = require("node:path");

const SCREEN_DIRECTORY_RELATIVE_PATH = path.join("apps", "web", "src", "screens");
const OUTPUT_DIRECTORY_RELATIVE_PATH = path.join("docs", "design-system", "wireframes");
const NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

function toPascalCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function validateWireframeName(screenName) {
  if (!screenName) {
    throw new Error("Usage: npm run generate:wireframe -- <screen-name>");
  }

  if (!NAME_PATTERN.test(screenName)) {
    throw new Error("Screen name must be lowercase kebab-case or a simple lowercase route id.");
  }
}

function getPaths(rootDir, screenName) {
  return {
    sourcePath: path.join(
      rootDir,
      SCREEN_DIRECTORY_RELATIVE_PATH,
      `${toPascalCase(screenName)}Screen.tsx`
    ),
    outputDirectoryPath: path.join(rootDir, OUTPUT_DIRECTORY_RELATIVE_PATH),
    outputPath: path.join(rootDir, OUTPUT_DIRECTORY_RELATIVE_PATH, `${screenName}.json`),
  };
}

function collectMatches(pattern, source) {
  const values = new Set();

  for (const match of source.matchAll(pattern)) {
    values.add(match[1]);
  }

  return [...values];
}

function extractTitle(source, screenName) {
  const titleMatch = source.match(/<Placard title="([^"]+)">/);

  if (titleMatch) {
    return titleMatch[1];
  }

  return `${toPascalCase(screenName)} Screen`;
}

function extractEyebrow(source) {
  const eyebrowMatch = source.match(/<Strike eyebrow="([^"]+)"/);
  return eyebrowMatch ? eyebrowMatch[1] : null;
}

function extractNotes(source, screenName) {
  const notes = [
    "Derived from the current migration-kit screen source.",
    "Semantic tokens only. No hardcoded hex, rgb, or hsl values allowed in migrated screen code.",
    "Legacy route fallback remains the committed default until the feature flag flips.",
  ];

  if (source.includes("navigate('/register')")) {
    notes.push("Screen includes register-navigation behavior.");
  }

  if (source.includes("handleSubmit")) {
    notes.push("Screen includes a submit interaction placeholder.");
  }

  if (screenName === "login") {
    notes.push("This wireframe documents the first migrated route.");
  }

  return notes;
}

function createWireframeDocument(screenName, source, sourceRelativePath) {
  const componentNames = collectMatches(
    /import\s+\{\s*([A-Za-z0-9_]+)\s*\}\s+from\s+'..\/components\/ui\/[^']+'/g,
    source
  );
  const classNames = collectMatches(/className="([^"]+)"/g, source);
  const testIds = collectMatches(/data-testid="([^"]+)"/g, source);

  return {
    schemaVersion: 1,
    route: `/${screenName}`,
    screenName: `${toPascalCase(screenName)}Screen`,
    sourceFile: sourceRelativePath,
    title: extractTitle(source, screenName),
    eyebrow: extractEyebrow(source),
    layout: {
      rootElement: "section",
      archetype: "Slab",
      components: componentNames,
      classNames,
      testIds,
    },
    tokenPolicy: {
      semanticOnly: true,
      allowedPrefixes: ["--sys-color-", "--sys-shape-", "--sys-type-"],
      zeroFlora: true,
      bannedTokens: [
        "labWrenMetalBlue",
        "GumLeafGreen",
        "WattleGold",
        "inkGreen",
      ],
      bannedArchetypes: ["Jar", "Cabinet", "Seed", "Leaf"],
    },
    notes: extractNotes(source, screenName),
  };
}

function generateWireframe(rootDir, screenName) {
  validateWireframeName(screenName);
  const { sourcePath, outputDirectoryPath, outputPath } = getPaths(rootDir, screenName);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing screen source: ${sourcePath}`);
  }

  fs.mkdirSync(outputDirectoryPath, { recursive: true });

  const source = fs.readFileSync(sourcePath, "utf8");
  const sourceRelativePath = path.relative(rootDir, sourcePath);
  const document = createWireframeDocument(screenName, source, sourceRelativePath);

  fs.writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");

  return {
    outputPath,
    screenName,
  };
}

module.exports = {
  OUTPUT_DIRECTORY_RELATIVE_PATH,
  SCREEN_DIRECTORY_RELATIVE_PATH,
  createWireframeDocument,
  generateWireframe,
  toPascalCase,
  validateWireframeName,
};
