#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const frontendRoot = path.join(repoRoot, 'frontend');
const srcRoot = path.join(frontendRoot, 'src');
const appPath = path.join(srcRoot, 'App.tsx');
const snapshotPath = path.join(frontendRoot, 'analysis', 'react-components-snapshot.json');
const outputJsonPath = path.join(frontendRoot, 'analysis', 'frontend-architecture-report.json');
const outputMdPath = path.join(
  repoRoot,
  'docs',
  'analysis',
  'frontend-architecture-current-state.md'
);
const outputDiagramPath = path.join(
  repoRoot,
  'docs',
  'diagrams',
  'frontend-architecture-cleanup.mmd'
);

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function normalizeSlashes(value) {
  return value.split(path.sep).join('/');
}

function routeFamily(routePath) {
  if (routePath === '/') return 'landing';
  if (
    routePath.startsWith('/login') ||
    routePath.startsWith('/register') ||
    routePath.startsWith('/welcome') ||
    routePath.startsWith('/onboarding') ||
    routePath.startsWith('/kr/auth') ||
    routePath.startsWith('/kr/onboarding')
  ) {
    return 'auth-onboarding';
  }
  if (routePath.startsWith('/career/ingest')) return 'ingestion';
  if (routePath.startsWith('/dashboard') || routePath.startsWith('/kr/dashboard'))
    return 'dashboard';
  if (
    routePath.startsWith('/analysis') ||
    routePath.startsWith('/asset-library') ||
    routePath.startsWith('/kr/analysis')
  ) {
    return 'analysis';
  }
  if (routePath.startsWith('/documents')) return 'documents';
  if (routePath.startsWith('/tracker') || routePath.startsWith('/apply/quick'))
    return 'applications';
  if (routePath.startsWith('/opportunities') || routePath.startsWith('/job-queue')) return 'jobs';
  if (routePath.startsWith('/ksc-generator') || routePath.startsWith('/cover-letter-generator'))
    return 'generation';
  if (routePath.startsWith('/profile') || routePath.startsWith('/settings')) return 'account';
  if (
    routePath.startsWith('/design-sidekick') ||
    routePath.startsWith('/style-guide') ||
    routePath.startsWith('/test-tokens')
  ) {
    return 'internal-tools';
  }
  if (routePath.startsWith('/kr/landing')) return 'landing-prototype';
  if (routePath === '*') return 'fallback';
  return 'other';
}

function routeLayer(routePath) {
  if (routePath.startsWith('/kr/')) return 'prototype';
  if (
    routePath === '/design-sidekick' ||
    routePath === '/style-guide' ||
    routePath === '/test-tokens'
  ) {
    return 'internal';
  }
  return 'runtime';
}

function bucketFromImportPath(importPath) {
  if (!importPath) return 'unknown';
  if (importPath.startsWith('./pages/')) return 'pages';
  if (importPath.startsWith('./features/')) return 'features';
  if (importPath.startsWith('./components/')) return 'components';
  if (importPath.startsWith('./layouts/')) return 'layouts';
  return 'other';
}

function parseImports(appSource) {
  const imports = new Map();
  const importRegex = /import\s+(?:\{\s*([^}]+)\s*\}|([A-Za-z0-9_$]+))\s+from\s+'([^']+)'/g;

  let match;
  while ((match = importRegex.exec(appSource)) !== null) {
    const named = match[1];
    const defaultImport = match[2];
    const from = match[3];

    if (named) {
      named
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((name) => {
          const localName = name.split(/\s+as\s+/).pop();
          imports.set(localName, from);
        });
    }

    if (defaultImport) {
      imports.set(defaultImport, from);
    }
  }

  return imports;
}

function parseRoutes(appSource, importMap) {
  const routeRegex = /path="([^"]+)"[\s\S]*?element={<([^\s/>]+)/g;
  const routes = [];
  let match;

  while ((match = routeRegex.exec(appSource)) !== null) {
    const routePath = match[1];
    const component = match[2];
    routes.push({
      path: routePath,
      component,
      importPath: importMap.get(component) ?? null,
      family: routeFamily(routePath),
      layer: routeLayer(routePath),
    });
  }

  return routes;
}

function inferAbsolutePath(importPath) {
  if (!importPath) return null;
  if (!importPath.startsWith('.')) return null;
  return path.join(srcRoot, `${importPath.replace(/^\.\//, '')}.tsx`);
}

function relativeSnapshotPathFromImport(importPath) {
  if (!importPath || !importPath.startsWith('./')) return null;
  return `${importPath.replace(/^\.\//, '')}.tsx`;
}

function countImports(source) {
  return (source.match(/^import /gm) || []).length;
}

function countJsxTags(source) {
  return (source.match(/<([A-Z][A-Za-z0-9]*)\b/g) || []).length;
}

function countMeaningfulLines(source) {
  return source
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('//')).length;
}

function scanFileMetrics(relativePath) {
  const absolutePath = path.join(srcRoot, relativePath);
  if (!fs.existsSync(absolutePath)) return null;
  const source = readText(absolutePath);
  return {
    relativePath,
    lines: countMeaningfulLines(source),
    importCount: countImports(source),
    jsxTagCount: countJsxTags(source),
  };
}

function bucketCounts(snapshot) {
  const counts = {};
  for (const [bucket, summary] of Object.entries(snapshot.summary.byBucket)) {
    counts[bucket] = {
      files: summary.files,
      components: summary.components,
      likelyPagesOrScreens: summary.likelyPagesOrScreens,
    };
  }
  return counts;
}

function collectLikelySurfaces(snapshot) {
  const items = [];
  for (const file of snapshot.files) {
    for (const component of file.components) {
      if (component.isLikelyPageOrScreen) {
        items.push({
          name: component.name,
          filePath: file.path,
          bucket: file.bucket,
          exportKind: component.exportKind,
        });
      }
    }
  }

  const unique = new Map();
  for (const item of items) {
    unique.set(`${item.name}|${item.filePath}`, item);
  }
  return [...unique.values()];
}

function collectDuplicateNames(snapshot) {
  const byName = new Map();

  for (const file of snapshot.files) {
    for (const component of file.components) {
      const key = component.name;
      const list = byName.get(key) ?? [];
      list.push({ filePath: file.path, bucket: file.bucket });
      byName.set(key, list);
    }
  }

  return [...byName.entries()]
    .filter(([, files]) => {
      const uniquePaths = new Set(files.map((file) => file.filePath));
      return uniquePaths.size > 1;
    })
    .map(([name, files]) => ({
      name,
      files: [...new Map(files.map((file) => [file.filePath, file])).values()],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function groupRoutes(routes) {
  const grouped = {};
  for (const route of routes) {
    if (!grouped[route.family]) grouped[route.family] = [];
    grouped[route.family].push(route);
  }
  return grouped;
}

function buildReport() {
  const snapshot = JSON.parse(readText(snapshotPath));
  const appSource = readText(appPath);
  const importMap = parseImports(appSource);
  const routes = parseRoutes(appSource, importMap);
  const routeGroups = groupRoutes(routes);
  const likelySurfaces = collectLikelySurfaces(snapshot);
  const duplicateNames = collectDuplicateNames(snapshot);
  const routedNames = new Set(routes.map((route) => route.component));

  const routedSurfaces = likelySurfaces.filter((surface) => routedNames.has(surface.name));
  const unroutedSurfaces = likelySurfaces.filter((surface) => !routedNames.has(surface.name));

  const routeMetrics = routes
    .map((route) => {
      const importPath = route.importPath?.replace(/^\.\//, '');
      const metrics = importPath
        ? scanFileMetrics(importPath + '.tsx'.replace('.tsx.tsx', '.tsx'))
        : null;
      if (!metrics && route.importPath) {
        const altPath = inferAbsolutePath(route.importPath);
        if (altPath && fs.existsSync(altPath)) {
          const rel = normalizeSlashes(path.relative(srcRoot, altPath));
          return { ...route, metrics: scanFileMetrics(rel) };
        }
      }
      return { ...route, metrics };
    })
    .map((route) => {
      const metric = route.metrics;
      return {
        ...route,
        metrics: metric,
      };
    });

  const godComponentCandidates = routeMetrics
    .filter((route) => route.metrics)
    .filter(
      (route) =>
        route.metrics.lines >= 250 ||
        route.metrics.importCount >= 18 ||
        route.metrics.jsxTagCount >= 40
    )
    .sort((a, b) => (b.metrics?.lines ?? 0) - (a.metrics?.lines ?? 0))
    .map((route) => ({
      route: route.path,
      component: route.component,
      importPath: route.importPath,
      metrics: route.metrics,
    }));

  const routeOwnership = routes.map((route) => {
    const expectedSnapshotPath = relativeSnapshotPathFromImport(route.importPath);
    const matchingSurface =
      likelySurfaces.find((surface) => surface.filePath === expectedSnapshotPath) ??
      likelySurfaces.find((surface) => surface.name === route.component);
    const importBucket = bucketFromImportPath(route.importPath);
    return {
      path: route.path,
      component: route.component,
      family: route.family,
      layer: route.layer,
      importPath: route.importPath,
      bucket: importBucket !== 'unknown' ? importBucket : (matchingSurface?.bucket ?? 'unknown'),
      canonicalStatus:
        route.layer === 'prototype'
          ? 'prototype'
          : route.layer === 'internal'
            ? 'internal'
            : 'canonical',
      candidateReplacements: unroutedSurfaces
        .filter((surface) => {
          const family = route.family;
          if (family === 'ingestion') return /Ingestion/.test(surface.name);
          if (family === 'jobs') return /Lookout|JobQueue/.test(surface.name);
          if (family === 'applications') return /Kanban|ApplicationFinalization/.test(surface.name);
          if (family === 'documents') return /DocumentWorkbench/.test(surface.name);
          if (family === 'account')
            return route.path === '/settings' && /SettingsControl/.test(surface.name);
          return false;
        })
        .map((surface) => ({
          name: surface.name,
          filePath: surface.filePath,
          bucket: surface.bucket,
        })),
    };
  });

  const smells = [];
  if (duplicateNames.length > 0) {
    smells.push(`${duplicateNames.length} component names exist in multiple files.`);
  }
  if (unroutedSurfaces.length > 0) {
    smells.push(`${unroutedSurfaces.length} likely page/screen components are currently unrouted.`);
  }
  const prototypeCount = routes.filter((route) => route.layer === 'prototype').length;
  if (prototypeCount > 0) {
    smells.push(`${prototypeCount} live routes sit under the prototype /kr namespace.`);
  }
  if (godComponentCandidates.length > 0) {
    smells.push(
      `${godComponentCandidates.length} routed surfaces exceed the god-component threshold.`
    );
  }

  return {
    generatedAt: new Date().toISOString(),
    sources: {
      app: 'frontend/src/App.tsx',
      snapshot: 'frontend/analysis/react-components-snapshot.json',
    },
    summary: {
      totalRoutes: routes.length,
      routeFamilies: Object.keys(routeGroups).length,
      bucketCounts: bucketCounts(snapshot),
      likelySurfaceCount: likelySurfaces.length,
      routedSurfaceCount: routedSurfaces.length,
      unroutedSurfaceCount: unroutedSurfaces.length,
      prototypeRouteCount: prototypeCount,
    },
    routeGroups,
    routeOwnership,
    likelySurfaces: {
      routed: routedSurfaces,
      unrouted: unroutedSurfaces,
    },
    duplicateNames,
    godComponentCandidates,
    smells,
  };
}

function mermaidId(value) {
  return (
    value
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase() || 'node'
  );
}

function renderMermaid(report) {
  const lines = ['flowchart LR', ''];
  const families = Object.entries(report.routeGroups).sort((a, b) => a[0].localeCompare(b[0]));

  for (const [family, routes] of families) {
    lines.push(`    subgraph ${mermaidId(family)}["${family}"]`);
    for (const route of routes) {
      const id = mermaidId(`${family}_${route.path}`);
      lines.push(`        ${id}["${route.path} -> ${route.component}"]`);
    }
    lines.push('    end', '');
  }

  lines.push('    subgraph unrouted["unrouted screen candidates"]');
  for (const surface of report.likelySurfaces.unrouted) {
    lines.push(
      `        ${mermaidId(`unrouted_${surface.name}`)}["${surface.name} (${surface.filePath})"]`
    );
  }
  lines.push('    end', '');

  for (const item of report.routeOwnership) {
    const sourceId = mermaidId(`${item.family}_${item.path}`);
    for (const candidate of item.candidateReplacements) {
      const targetId = mermaidId(`unrouted_${candidate.name}`);
      lines.push(`    ${sourceId} -.candidate.-> ${targetId}`);
    }
  }

  return lines.join('\n') + '\n';
}

function renderMarkdown(report) {
  const familyLines = Object.entries(report.routeGroups)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([family, routes]) => {
      const compact = routes.map((route) => `\`${route.path}\``).join(', ');
      return `- \`${family}\`: ${routes.length} routes — ${compact}`;
    })
    .join('\n');

  const bucketLines = Object.entries(report.summary.bucketCounts)
    .map(
      ([bucket, counts]) =>
        `- \`${bucket}\`: ${counts.files} files, ${counts.components} exported components, ${counts.likelyPagesOrScreens} likely pages/screens`
    )
    .join('\n');

  const duplicateLines =
    report.duplicateNames.length > 0
      ? report.duplicateNames
          .slice(0, 10)
          .map(
            (entry) =>
              `- \`${entry.name}\` appears in ${entry.files.map((file) => `\`${file.filePath}\``).join(', ')}`
          )
          .join('\n')
      : '- No duplicate component names detected across buckets.';

  const unroutedLines =
    report.likelySurfaces.unrouted.length > 0
      ? report.likelySurfaces.unrouted
          .map((surface) => `- \`${surface.name}\` in \`${surface.filePath}\` (${surface.bucket})`)
          .join('\n')
      : '- No unrouted likely screens/pages detected.';

  const godLines =
    report.godComponentCandidates.length > 0
      ? report.godComponentCandidates
          .slice(0, 10)
          .map(
            (item) =>
              `- \`${item.component}\` (\`${item.route}\`) — ${item.metrics.lines} lines, ${item.metrics.importCount} imports, ${item.metrics.jsxTagCount} JSX tags`
          )
          .join('\n')
      : '- No routed surfaces exceeded the configured complexity threshold.';

  const ownershipRows = report.routeOwnership
    .map(
      (item) =>
        `| \`${item.path}\` | \`${item.component}\` | \`${item.family}\` | \`${item.layer}\` | \`${item.bucket}\` | ${
          item.candidateReplacements.length
            ? item.candidateReplacements.map((candidate) => `\`${candidate.name}\``).join(', ')
            : '—'
        } |`
    )
    .join('\n');

  return `# Frontend Architecture Current State

Generated from \`App.tsx\` and the current ts-morph snapshot. This is the phase-1 architecture cleanup baseline for route ownership, duplicate surfaces, and consolidation planning.

## Summary

- Live routes: ${report.summary.totalRoutes}
- Distinct route families: ${report.summary.routeFamilies}
- Likely pages/screens in snapshot: ${report.summary.likelySurfaceCount}
- Routed likely pages/screens: ${report.summary.routedSurfaceCount}
- Unrouted likely pages/screens: ${report.summary.unroutedSurfaceCount}
- Prototype \`/kr/*\` routes: ${report.summary.prototypeRouteCount}

## Route Families

${familyLines}

## Bucket Distribution

${bucketLines}

## Route Ownership Matrix

| Route | Current Owner | Family | Layer | Bucket | Candidate Replacement |
| --- | --- | --- | --- | --- | --- |
${ownershipRows}

## Duplicate Surface Signals

${duplicateLines}

## Unrouted Screen Candidates

${unroutedLines}

## Routed God-Component Candidates

${godLines}

## Primary Smells

${report.smells.map((smell) => `- ${smell}`).join('\n')}
`;
}

function main() {
  if (!fs.existsSync(snapshotPath)) {
    throw new Error(`Missing snapshot at ${snapshotPath}`);
  }

  const report = buildReport();
  fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true });
  fs.mkdirSync(path.dirname(outputMdPath), { recursive: true });
  fs.mkdirSync(path.dirname(outputDiagramPath), { recursive: true });
  fs.writeFileSync(outputJsonPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
  fs.writeFileSync(outputMdPath, renderMarkdown(report), 'utf8');
  fs.writeFileSync(outputDiagramPath, renderMermaid(report), 'utf8');

  console.log(`Wrote ${outputJsonPath}`);
  console.log(`Wrote ${outputMdPath}`);
  console.log(`Wrote ${outputDiagramPath}`);
}

main();
