#!/usr/bin/env node
const path = require("node:path");
const { generateScreen } = require("./migrate-screen-lib");

const screenName = process.argv[2];

try {
  const result = generateScreen(process.cwd(), screenName);
  process.stdout.write(
    `Generated ${path.basename(result.targetPath)} at ${result.targetPath}\n`
  );
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
