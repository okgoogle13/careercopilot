#!/usr/bin/env node
import path from 'node:path';
import {
  runMigrationAudit,
  writeMigrationAuditReport,
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
const route = readArgValue(argv, '--route')[0];
const benchmarkId = readArgValue(argv, '--benchmark')[0];
const screenshots = readArgValue(argv, '--screenshot');
const writeReport = argv.includes('--write-report');

if (!route) {
  process.stderr.write('Missing required argument: --route /path\n');
  process.exit(1);
}

try {
  const resolvedRoot = path.resolve(root);
  const result = runMigrationAudit({
    rootDir: resolvedRoot,
    route,
    benchmarkId,
    screenshots: screenshots.length > 0 ? screenshots : undefined,
  });

  process.stdout.write(JSON.stringify(result, null, 2));
  process.stdout.write('\n');

  if (writeReport) {
    const reportPath = writeMigrationAuditReport(
      resolvedRoot,
      result.migration_visual_audit.benchmark_id,
      result,
    );
    process.stderr.write(`wrote ${reportPath}\n`);
  }

  if (result.migration_visual_audit.status !== 'pass') {
    process.exitCode = 1;
  }
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
