// scan-api-usage.ts — Phase 1.3: Frontend API Usage Scanner
/**
 * scan-api-usage.ts — Phase 1.3: Frontend API Usage Scanner
 *
 * Scans frontend/src/api/*.ts files, extracts HTTP method + path patterns
 * from axios/fetch calls, and emits docs/manifests/frontend-api-usage.json.
 *
 * Usage:  npx tsx tools/scripts/scan-api-usage.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');
const API_DIR = path.join(ROOT, 'frontend/src/api');
const OUT = path.join(ROOT, 'docs/manifests/frontend-api-usage.json');

interface ApiCall {
  method: string;
  pathPattern: string;
  sourceFile: string;
  lineNumber: number;
}

function main() {
  const apiFiles = fs.readdirSync(API_DIR)
    .filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts') && !f.endsWith('.test.ts'))
    .filter(f => f !== 'index.ts');

  const calls: ApiCall[] = [];

  for (const file of apiFiles) {
    const filePath = path.join(API_DIR, file);
    const src = fs.readFileSync(filePath, 'utf-8');
    const lines = src.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Match patterns like: .get('/api/foo'), .post(`/api/bar/${id}`), axios.delete('/api/baz')
      const httpRe = /\.(get|post|put|patch|delete)\s*[(<]\s*['"`]([^'"`]+)['"`]/gi;
      let m: RegExpExecArray | null;
      while ((m = httpRe.exec(line)) !== null) {
        const method = m[1].toUpperCase();
        let pathPattern = m[2];

        // Normalize template literals: replace ${...} with :param
        pathPattern = pathPattern.replace(/\$\{[^}]+\}/g, ':param');

        calls.push({
          method,
          pathPattern,
          sourceFile: file,
          lineNumber: i + 1,
        });
      }
    }
  }

  // Deduplicate by method + pathPattern
  const uniqueEndpoints = new Map<string, ApiCall>();
  for (const call of calls) {
    const key = `${call.method} ${call.pathPattern}`;
    if (!uniqueEndpoints.has(key)) {
      uniqueEndpoints.set(key, call);
    }
  }

  const result = {
    generatedAt: new Date().toISOString(),
    totalCalls: calls.length,
    uniqueEndpoints: uniqueEndpoints.size,
    filesScanned: apiFiles.length,
    calls,
    unique: Array.from(uniqueEndpoints.values()).map(c => ({
      method: c.method,
      pathPattern: c.pathPattern,
      firstSeenIn: c.sourceFile,
    })),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2));

  console.log(`✅ Scanned ${apiFiles.length} API files, found ${calls.length} calls (${uniqueEndpoints.size} unique) → ${path.relative(ROOT, OUT)}`);
}

main();
