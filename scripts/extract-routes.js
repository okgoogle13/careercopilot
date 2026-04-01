#!/usr/bin/env node
/**
 * extract-routes.js
 * Parses App.tsx and route-registry.ts to produce docs/manifests/routes.json
 * Authority: route-registry.ts is the source of truth for route metadata.
 *            App.tsx is the source of truth for actual component bindings.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const APP_TSX = path.join(ROOT, 'frontend/src/App.tsx');
const REGISTRY_TS = path.join(ROOT, 'frontend/src/config/route-registry.ts');

function extractAppRoutes(content) {
  const routes = [];
  const simpleRoute = /path="([^"]+)"[^>]*element=\{[^<]*<(\w+)/g;
  let match;
  while ((match = simpleRoute.exec(content)) !== null) {
    routes.push({ path: match[1], component: match[2] });
  }
  return routes;
}

function extractImports(content) {
  const imports = {};
  const namedImportBlock = /import\s+\{([^}]+)\}\s+from\s+'([^']+)'/g;
  let match;
  while ((match = namedImportBlock.exec(content)) !== null) {
    const src = match[2];
    const names = match[1].split(',').map(n => n.trim());
    for (const n of names) {
      const parts = n.split(/\s+as\s+/);
      const key = parts[parts.length - 1].trim();
      if (key) imports[key] = src;
    }
  }
  // Default imports
  const defaultImport = /import\s+(\w+)\s+from\s+'([^']+)'/g;
  while ((match = defaultImport.exec(content)) !== null) {
    imports[match[1]] = match[2];
  }
  return imports;
}

function extractRegistryRoutes(content) {
  const registry = [];
  const entryRegex = /\{([^{}]+)\}/g;
  let match;
  while ((match = entryRegex.exec(content)) !== null) {
    const block = match[1];
    const pathMatch = /path:\s*'([^']+)'/.exec(block);
    const authMatch = /auth:\s*(true|false)/.exec(block);
    const layoutMatch = /layout:\s*'([^']+)'/.exec(block);
    const screenMatch = /screenId:\s*'([^']+)'/.exec(block);
    const protoMatch = /prototype:\s*(true|false)/.exec(block);
    if (pathMatch) {
      registry.push({
        path: pathMatch[1],
        auth: authMatch ? authMatch[1] === 'true' : false,
        layout: layoutMatch ? layoutMatch[1] : 'unknown',
        screenId: screenMatch ? screenMatch[1] : null,
        prototype: protoMatch ? protoMatch[1] === 'true' : false,
      });
    }
  }
  return registry;
}

const appContent = fs.readFileSync(APP_TSX, 'utf8');
const registryContent = fs.readFileSync(REGISTRY_TS, 'utf8');

const appRoutes = extractAppRoutes(appContent);
const imports = extractImports(appContent);
const registryRoutes = extractRegistryRoutes(registryContent);

const registryMap = {};
for (const r of registryRoutes) {
  registryMap[r.path] = r;
}

const merged = appRoutes.map(r => {
  const reg = registryMap[r.path] || {};
  return {
    path: r.path,
    component: r.component,
    importSource: imports[r.component] || 'UNKNOWN',
    auth: reg.auth !== undefined ? reg.auth : false,
    layout: reg.layout || 'public',
    screenId: reg.screenId || null,
    prototype: reg.prototype || false,
  };
});

for (const reg of registryRoutes) {
  if (!merged.find(m => m.path === reg.path)) {
    merged.push({
      path: reg.path,
      component: 'UNRESOLVED',
      importSource: 'UNKNOWN',
      auth: reg.auth,
      layout: reg.layout,
      screenId: reg.screenId,
      prototype: reg.prototype,
    });
  }
}

const output = {
  generatedAt: new Date().toISOString(),
  count: merged.length,
  routes: merged,
};

process.stdout.write(JSON.stringify(output, null, 2) + '\n');
