#!/usr/bin/env node
/**
 * extract-api-usage.js
 * Scans frontend/src/ for API call patterns and emits docs/manifests/frontend-api-usage.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FRONTEND_SRC = path.join(ROOT, 'frontend/src');

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];

function walkDir(dir, exts, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === '_quarantine') continue;
      walkDir(full, exts, results);
    } else if (exts.some(e => full.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

const files = walkDir(FRONTEND_SRC, ['.ts', '.tsx']);
const calls = [];
const seen = new Set();

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const basename = path.basename(file);

  for (const method of HTTP_METHODS) {
    const re = new RegExp(`\\.${method}\\s*\\(\\s*[\`'"]([^\`'"]+)[\`'"]`, 'g');
    let match;
    while ((match = re.exec(content)) !== null) {
      const pathPattern = match[1];
      const pre = content.slice(0, match.index);
      const lineNumber = pre.split('\n').length;
      const key = `${method.toUpperCase()}:${pathPattern}:${basename}`;
      if (!seen.has(key)) {
        seen.add(key);
        calls.push({ method: method.toUpperCase(), pathPattern, sourceFile: basename, lineNumber });
      }
    }
  }

  // fetch()
  const fetchRe = /\bfetch\s*\(\s*[`'"]([^`'"]+)[`'"]/g;
  let match;
  while ((match = fetchRe.exec(content)) !== null) {
    const pathPattern = match[1];
    if (pathPattern.startsWith('http') && !pathPattern.includes('/api')) continue;
    const pre = content.slice(0, match.index);
    const lineNumber = pre.split('\n').length;
    const key = `FETCH:${pathPattern}:${basename}`;
    if (!seen.has(key)) {
      seen.add(key);
      calls.push({ method: 'GET', pathPattern, sourceFile: basename, lineNumber });
    }
  }
}

const uniqueEndpoints = new Set(calls.map(c => c.pathPattern)).size;

const output = {
  generatedAt: new Date().toISOString(),
  totalCalls: calls.length,
  uniqueEndpoints,
  filesScanned: files.length,
  calls,
};

process.stdout.write(JSON.stringify(output, null, 2) + '\n');
