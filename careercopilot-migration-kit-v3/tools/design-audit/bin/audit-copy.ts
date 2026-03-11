#!/usr/bin/env node
import path from 'node:path';
import {
  formatHumanReport,
  formatJsonReport,
  runAudit,
} from '../../../packages/design-audit/src/index.js';

function readArgValue(args: string[], flag: string): string[] {
  const values: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag && args[index + 1]) {
      values.push(args[index + 1]);
      index += 1;
    }
  }

  return values;
}

const argv = process.argv.slice(2);
const root = readArgValue(argv, '--root')[0] ?? process.cwd();
const json = argv.includes('--json');

try {
  const report = runAudit({
    rootDir: path.resolve(root),
    mode: 'copy',
  });

  process.stdout.write(json ? formatJsonReport(report) : formatHumanReport(report));
  process.stdout.write('\n');

  if (report.summary.errorCount > 0) {
    process.exitCode = 1;
  }
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
