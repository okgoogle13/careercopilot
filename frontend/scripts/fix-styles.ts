#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fg from 'fast-glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

function fixContent(src: string) {
  let out = src;
  // borderRadius/unit literals without quotes -> quote them
  out = out.replace(
    /(:\s*)([0-9]+(?:\.[0-9]+)?)\s*(px|rem)(\s*[,}])/g,
    (_m, p1, num, unit, tail) => `${p1}"${num}${unit}"${tail}`
  );
  // generic numeric css with px/rem in any property
  out = out.replace(
    /(:\s*)([0-9]+(?:\.[0-9]+)?)\s*(px|rem)(\s*[,}])/g,
    (_m, p1, num, unit, tail) => `${p1}"${num}${unit}"${tail}`
  );
  // remove stray [object Object]
  out = out.replace(/\[object Object\]/g, '');
  // typography token identifiers -> strings
  out = out.replace(
    /(typography\s*:\s*)(body1|body2|h1|h2|h3|h4|h5|h6)(\b)/g,
    (_m, p1, tok, p3) => `${p1}"${tok}"${p3}`
  );
  // Remove Tailwind-like boolean class keys inside sx objects: "w-3": true, "group-hover:opacity-100": true, etc.
  // Remove any quoted property keys with boolean/number or empty object values
  out = out.replace(/\n?\s*\"[^\"]+\"\s*:\s*(true|false|[0-9]+|\{\s*\})\s*,?/g, '');
  // Remove &:hover blocks that became empty after cleanup: '&:hover': { }
  out = out.replace(/(&:\w+\s*:\s*)\{\s*\}/g, '');
  // Remove duplicate &:hover keys by collapsing consecutive empty commas
  out = out.replace(/,\s*,/g, ',');
  return out;
}

async function main() {
  const files = await fg(['src/components/**/*.tsx'], { cwd: ROOT, absolute: true });
  let changed = 0;
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const out = fixContent(src);
    if (out !== src) {
      fs.writeFileSync(file, out, 'utf8');
      changed++;
    }
  }
  console.log(`Fixed ${changed} files.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
