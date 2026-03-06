#!/usr/bin/env node
/**
 * frontend-design-orchestrator scaffold (integrated v1).
 *
 * This file intentionally keeps path-normalizer, token-safety-batch-linter,
 * wireframe-contract-validator, and visual-audit stages in one module so we can
 * ship a single batch entrypoint quickly.
 *
 * Future hardening will extract these stages into dedicated modules while
 * preserving the same CLI contract:
 *   - design:orchestrate:all
 *   - design:orchestrate:visual-audit
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import net from 'node:net';

const ROOT = process.cwd();
const modeArg = process.argv.find((a) => a.startsWith('--mode='));
const mode = modeArg ? modeArg.split('=')[1] : 'all';
const runId = new Date().toISOString().replace(/[:.]/g, '-');

const paths = {
  visualTargets: path.join(ROOT, 'design/contracts/visual-audit-targets.json'),
  runtimeProbes: path.join(ROOT, 'design/contracts/runtime-probes.json'),
  runsDir: path.join(ROOT, 'docs/design/runs'),
  readinessJson: path.join(ROOT, 'docs/design/generated/design-readiness.json'),
  readinessMd: path.join(ROOT, 'docs/design/design-readiness.md'),
  galleryMd: path.join(ROOT, 'docs/design/generated/visual-audit-gallery.md'),
  previewsDir: path.join(ROOT, 'docs/design/generated/previews'),
};

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function walk(dir, exts = null) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, exts));
    } else if (!exts || exts.includes(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function rel(p) {
  return path.relative(ROOT, p);
}


function legacySkillWrapperCheck() {
  const lifecyclePath = path.join(ROOT, 'design/contracts/skill-lifecycle.json');
  const missing = [];
  const wrapped = [];

  const lifecycle = fs.existsSync(lifecyclePath)
    ? readJson(lifecyclePath)
    : { skills: [] };

  const wrappedSkills = (lifecycle.skills || []).filter((s) => s.state === 'WRAP').map((s) => s.name);

  for (const skill of wrappedSkills) {
    const skillPath = path.join(ROOT, '.claude/skills', skill, 'SKILL.md');
    if (fs.existsSync(skillPath)) wrapped.push(skill);
    else missing.push(skill);
  }

  return {
    name: 'legacy-skill-wrapper-map',
    passed: missing.length === 0,
    details: { wrappedSkills: wrapped.length, missingSkills: missing.length },
    violations: missing.map((skill) => ({ type: 'missing_wrapped_skill', skill })),
    wrapped,
  };
}

function pathNormalizerCheck() {
  const violations = [];
  const generatedSpecs = path.join(ROOT, 'docs/design/generated/specs');
  const canonicalSpecs = path.join(ROOT, 'docs/design/specs');

  const generated = walk(generatedSpecs, ['.md']);
  const canonical = walk(canonicalSpecs, ['.md']);

  if (generated.length > 0) {
    violations.push({
      type: 'path_mismatch',
      message: `Found ${generated.length} specs in docs/design/generated/specs; canonical path is docs/design/specs`,
      files: generated.map(rel),
    });
  }

  return {
    name: 'path-normalizer',
    passed: violations.length === 0,
    details: {
      generatedSpecsCount: generated.length,
      canonicalSpecsCount: canonical.length,
    },
    violations,
  };
}

function tokenSafetyCheck() {
  const scanRoots = [
    path.join(ROOT, 'docs/design/generated/specs'),
    path.join(ROOT, 'docs/design/generated/wireframes'),
    path.join(ROOT, 'frontend/src'),
  ];

  const patterns = [
    { id: 'hardcoded_hex', re: /#[0-9A-Fa-f]{3,8}\b/g },
    { id: 'hardcoded_rgba', re: /rgba?\(/g },
    { id: 'deprecated_marker', re: /\[DEPRECATED_STYLE\]/g },
  ];

  const violations = [];

  for (const root of scanRoots) {
    for (const file of walk(root, ['.md', '.tsx', '.ts', '.css'])) {
      const txt = fs.readFileSync(file, 'utf8');
      const lines = txt.split(/\r?\n/);
      for (const ptn of patterns) {
        for (let i = 0; i < lines.length; i++) {
          if (ptn.re.test(lines[i])) {
            violations.push({
              type: ptn.id,
              file: rel(file),
              line: i + 1,
              excerpt: lines[i].trim().slice(0, 180),
            });
          }
          ptn.re.lastIndex = 0;
        }
      }
    }
  }

  return {
    name: 'token-safety-batch-linter',
    passed: violations.length === 0,
    details: { violationsCount: violations.length },
    violations,
  };
}

function wireframeContractCheck() {
  const required = ['layout', 'tokens', 'accessibility', 'states', 'assets'];
  const files = walk(path.join(ROOT, 'docs/design/generated/wireframes'), ['.md']);
  const violations = [];

  for (const file of files) {
    const txt = fs.readFileSync(file, 'utf8');
    const missing = required.filter((tag) => !txt.includes(`<${tag}>`));
    if (missing.length > 0) {
      violations.push({
        type: 'missing_wireframe_sections',
        file: rel(file),
        missing,
      });
    }
  }

  return {
    name: 'wireframe-contract-validator',
    passed: violations.length === 0,
    details: { checkedFiles: files.length, violationsCount: violations.length },
    violations,
  };
}

async function visualAuditCheck() {
  const targets = readJson(paths.visualTargets);
  const probes = readJson(paths.runtimeProbes);
  ensureDir(paths.previewsDir);

  const results = [];
  const server = await maybeStartFrontendServer(targets.baseUrl);
  let browser;
  let page;

  try {
    if (server.error) {
      results.push({ targetId: 'frontend-server', passed: false, errors: [server.error] });
      const failed = results.filter((r) => !r.passed);
      return {
        name: 'visual-audit',
        passed: failed.length === 0,
        details: {
          checkedTargets: results.length,
          failedTargets: failed.length,
        },
        results,
      };
    }
    const playwright = await import('playwright');
    browser = await playwright.chromium.launch({ headless: true });
    page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

    for (const t of targets.targets) {
      const probe = probes.targets.find((p) => p.targetId === t.id);
      const record = {
        targetId: t.id,
        route: t.route,
        url: probe?.url ?? targets.baseUrl + t.route,
        screenshot: `docs/design/generated/previews/${t.id}.png`,
        passed: true,
        probeResults: [],
        errors: [],
      };

      try {
        await page.goto(record.url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.screenshot({ path: path.join(ROOT, record.screenshot), fullPage: true });

        for (const check of probe?.checks ?? []) {
          if (check.type === 'selectorExists') {
            const exists = (await page.$(check.selector)) !== null;
            record.probeResults.push({ ...check, pass: exists });
            if (!exists) record.passed = false;
          }
          if (check.type === 'cssVarPresent') {
            const found = await page.evaluate((sel, prop, valContains) => {
              const el = document.querySelector(sel);
              if (!el) return false;
              const v = window.getComputedStyle(el).getPropertyValue(prop);
              return v.includes(valContains);
            }, check.selector, check.property, check.valueContains);
            record.probeResults.push({ ...check, pass: found });
            if (!found) record.passed = false;
          }
        }
      } catch (error) {
        record.passed = false;
        record.errors.push(String(error));
      }

      results.push(record);
    }
  } catch (error) {
    results.push({
      targetId: 'visual-audit-engine',
      passed: false,
      errors: [`Playwright unavailable or failed: ${String(error)}`],
    });
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
    if (server.started && server.child) server.child.kill('SIGTERM');
  }

  const failed = results.filter((r) => !r.passed);

  return {
    name: 'visual-audit',
    passed: failed.length === 0,
    details: {
      checkedTargets: results.length,
      failedTargets: failed.length,
    },
    results,
  };
}


async function waitForPort(port, host = '127.0.0.1', timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ok = await new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1000);
      socket.once('connect', () => { socket.destroy(); resolve(true); });
      socket.once('error', () => { socket.destroy(); resolve(false); });
      socket.once('timeout', () => { socket.destroy(); resolve(false); });
      socket.connect(port, host);
    });
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function maybeStartFrontendServer(baseUrl) {
  let url;
  try {
    url = new URL(baseUrl);
  } catch {
    return { started: false };
  }
  const host = url.hostname || '127.0.0.1';
  const port = Number(url.port || (url.protocol === 'https:' ? 443 : 80));

  const alreadyUp = await waitForPort(port, host, 1500);
  if (alreadyUp) return { started: false };

  const child = spawn('yarn', ['workspace', 'careercopilot-frontend', 'dev', '--host', host, '--port', String(port)], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  });

  const maxLogLines = 50;
  const stdoutLines = [];
  const stderrLines = [];

  const appendLines = (chunk, buffer) => {
    const text = chunk.toString();
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      if (line === '') continue;
      buffer.push(line);
      if (buffer.length > maxLogLines) {
        buffer.splice(0, buffer.length - maxLogLines);
      }
    }
  };

  child.stdout?.on('data', (chunk) => appendLines(chunk, stdoutLines));
  child.stderr?.on('data', (chunk) => appendLines(chunk, stderrLines));

  const up = await waitForPort(port, host, 60000);
  if (!up) {
    child.kill('SIGTERM');

    let errorMessage = `Unable to start frontend dev server on ${host}:${port}`;
    if (stdoutLines.length || stderrLines.length) {
      errorMessage += '\n\n--- dev server stdout (last ' + stdoutLines.length + ' lines) ---\n'
        + stdoutLines.join('\n')
        + '\n\n--- dev server stderr (last ' + stderrLines.length + ' lines) ---\n'
        + stderrLines.join('\n');
    }

    return { started: false, error: errorMessage };
  }

  return { started: true, child };
}

function writeGallery(results) {
  const lines = ['# Visual Audit Gallery', '', `Generated: ${new Date().toISOString()}`, ''];
  for (const r of results) {
    lines.push(`## ${r.targetId}`);
    lines.push(`- Route: ${r.route ?? 'n/a'}`);
    lines.push(`- URL: ${r.url ?? 'n/a'}`);
    lines.push(`- Status: ${r.passed ? 'PASS' : 'FAIL'}`);
    if (r.screenshot && fs.existsSync(path.join(ROOT, r.screenshot))) {
      lines.push(`![${r.targetId}](${path.relative(path.dirname(paths.galleryMd), path.join(ROOT, r.screenshot)).replaceAll('\\', '/')})`);
    }
    if (r.errors?.length) {
      lines.push('- Errors:');
      for (const e of r.errors) lines.push(`  - ${e}`);
    }
    lines.push('');
  }
  fs.writeFileSync(paths.galleryMd, lines.join('\n'));
}

function writeReadiness(manifest) {
  const ci = {
    runId: manifest.runId,
    overallStatus: manifest.overallStatus,
    stages: manifest.stages.map((s) => ({ name: s.name, passed: s.passed })),
    visualAuditFailures: manifest.visualAuditFailures,
    generatedAt: manifest.generatedAt,
  };

  ensureDir(path.dirname(paths.readinessJson));
  fs.writeFileSync(paths.readinessJson, JSON.stringify(ci, null, 2));

  const lines = [
    '# Design Readiness',
    '',
    `- Run ID: ${manifest.runId}`,
    `- Generated: ${manifest.generatedAt}`,
    `- Overall Status: **${manifest.overallStatus.toUpperCase()}**`,
    '',
    '## Stage Results',
  ];
  for (const s of manifest.stages) {
    lines.push(`- ${s.passed ? '✅' : '❌'} ${s.name}`);
  }
  lines.push('', `- Visual audit failures: ${manifest.visualAuditFailures}`);
  lines.push(`- Run manifest: docs/design/runs/${manifest.runId}.json`);
  fs.writeFileSync(paths.readinessMd, lines.join('\n'));
}

async function main() {
  ensureDir(paths.runsDir);
  ensureDir(path.dirname(paths.galleryMd));

  const stages = [];
  if (mode === 'all') {
    stages.push(legacySkillWrapperCheck());
    stages.push(pathNormalizerCheck());
    stages.push(tokenSafetyCheck());
    stages.push(wireframeContractCheck());
    const visual = await visualAuditCheck();
    stages.push(visual);
    writeGallery(visual.results ?? []);
  } else if (mode === 'visual-audit') {
    const visual = await visualAuditCheck();
    stages.push(visual);
    writeGallery(visual.results ?? []);
  } else {
    throw new Error(`Unsupported mode: ${mode}`);
  }

  const failures = stages.filter((s) => !s.passed).length;
  const visualStage = stages.find((s) => s.name === 'visual-audit');
  const manifest = {
    runId,
    generatedAt: new Date().toISOString(),
    mode,
    overallStatus: failures === 0 ? 'pass' : 'fail',
    visualAuditFailures: visualStage?.details?.failedTargets ?? 0,
    stages,
  };

  const runFile = path.join(paths.runsDir, `${runId}.json`);
  fs.writeFileSync(runFile, JSON.stringify(manifest, null, 2));
  writeReadiness(manifest);

  console.log(`Design orchestrator completed: ${manifest.overallStatus}`);
  console.log(`Run manifest: ${rel(runFile)}`);
  console.log(`CI status: ${rel(paths.readinessJson)}`);

  if (manifest.overallStatus === 'fail') {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
