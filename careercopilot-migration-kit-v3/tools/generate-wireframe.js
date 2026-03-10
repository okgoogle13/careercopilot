#!/usr/bin/env node
const path = require("node:path");
const { generateWireframe } = require("./generate-wireframe-lib");

const screenName = process.argv[2];

try {
  const result = generateWireframe(process.cwd(), screenName);
  process.stdout.write(
    `Generated ${path.basename(result.outputPath)} at ${result.outputPath}\n`
  );
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
