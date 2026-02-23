#!/usr/bin/env node
/**
 * Component Manifest Generator
 *
 * Generates a comprehensive JSON manifest of all frontend components
 * for migration automation tooling.
 *
 * Usage: node scripts/generate-component-manifest.ts [--output manifest.json]
 */

import * as fs from "fs";
import * as path from "path";

interface ComponentMetadata {
  name: string;
  path: string;
  category: string;
  hasIndex: boolean;
  hasTest: boolean;
  hasStories: boolean;
  hasCss: boolean;
  exportType: "default" | "named" | "mixed" | "unknown";
  usesmui: boolean;
  usesTailwind: boolean;
  complexity: "low" | "medium" | "high" | "unknown";
  migrationReady: boolean;
  issues: string[];
  dependencies: string[];
  propsInterface?: string;
}

interface Manifest {
  generated: string;
  version: string;
  totalComponents: number;
  readinessScore: number;
  components: ComponentMetadata[];
  summary: {
    byCategory: Record<string, number>;
    byReadiness: Record<string, number>;
    issuesSummary: Record<string, number>;
  };
}

const COMPONENTS_DIR = path.join(process.cwd(), "frontend/src/components");
const OUTPUT_FILE = process.argv.includes("--output")
  ? process.argv[process.argv.indexOf("--output") + 1]
  : "component-manifest.json";

/**
 * Recursively find all component files
 */
function findComponentFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (!["__tests__", "__mocks__", "node_modules"].includes(entry.name)) {
          walk(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
        // Skip test and story files
        if (!entry.name.includes(".test.") && !entry.name.includes(".stories.")) {
          files.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return files;
}

/**
 * Analyze a component file for metadata
 */
function analyzeComponent(filePath: string): ComponentMetadata {
  const content = fs.readFileSync(filePath, "utf-8");
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath, ".tsx");
  const relativePath = path.relative(COMPONENTS_DIR, filePath);
  const category = relativePath.split("/")[0] || "root";

  const issues: string[] = [];

  // Check for index file
  const hasIndex =
    fs.existsSync(path.join(dir, "index.ts")) || fs.existsSync(path.join(dir, "index.tsx"));
  if (!hasIndex) issues.push("missing-index");

  // Check for test file
  const hasTest = fs.existsSync(path.join(dir, `${fileName}.test.tsx`));
  if (!hasTest) issues.push("missing-test");

  // Check for stories file
  const hasStories = fs.existsSync(path.join(dir, `${fileName}.stories.tsx`));
  if (!hasStories) issues.push("missing-storybook");

  // Check for CSS file
  const hasCss =
    fs.existsSync(path.join(dir, `${fileName}.css`)) ||
    fs.existsSync(path.join(dir, `${fileName}.module.css`));

  // Detect export type
  let exportType: ComponentMetadata["exportType"] = "unknown";
  const hasDefaultExport = /export\s+default/.test(content);
  const hasNamedExport = /export\s+(function|const|interface)/.test(content);

  if (hasDefaultExport && hasNamedExport) exportType = "mixed";
  else if (hasDefaultExport) exportType = "default";
  else if (hasNamedExport) exportType = "named";

  if (exportType === "unknown" || exportType === "mixed") {
    issues.push("inconsistent-exports");
  }

  // Detect MUI usage
  const usesmui = /from\s+['"]@mui\//.test(content);

  // Detect Tailwind usage
  const usesTailwind =
    /className\s*=\s*['"`]/.test(content) && /(text-|bg-|flex|grid|p-|m-|w-|h-)/.test(content);

  // Estimate complexity (basic heuristic)
  const lines = content.split("\n").length;
  const hooks = (content.match(/use[A-Z]\w+/g) || []).length;
  let complexity: ComponentMetadata["complexity"] = "unknown";

  if (lines < 100 && hooks < 3) complexity = "low";
  else if (lines < 300 && hooks < 7) complexity = "medium";
  else if (lines >= 300 || hooks >= 7) complexity = "high";

  // Check for PascalCase directory
  const dirName = path.basename(dir);
  if (/^[A-Z]/.test(dirName) && dirName !== fileName) {
    issues.push("pascalcase-directory");
  }

  // Extract dependencies (imports)
  const importMatches = content.matchAll(/import\s+.*?from\s+['"]([^'"]+)['"]/g);
  const dependencies = Array.from(importMatches)
    .map((match) => match[1])
    .filter((dep) => !dep.startsWith(".") && !dep.startsWith("@/")); // Only external deps

  // Try to extract props interface
  const propsMatch = content.match(/interface\s+(\w+Props)\s*{/);
  const propsInterface = propsMatch ? propsMatch[1] : undefined;

  // Determine migration readiness
  const migrationReady =
    hasIndex && hasTest && exportType === "named" && !/pascalcase-directory/.test(issues.join());

  return {
    name: fileName,
    path: relativePath,
    category,
    hasIndex,
    hasTest,
    hasStories,
    hasCss,
    exportType,
    usesmui,
    usesTailwind,
    complexity,
    migrationReady,
    issues,
    dependencies: [...new Set(dependencies)], // Deduplicate
    propsInterface,
  };
}

/**
 * Generate the full manifest
 */
function generateManifest(): Manifest {
  console.log("🔍 Scanning components...");
  const componentFiles = findComponentFiles(COMPONENTS_DIR);
  console.log(`Found ${componentFiles.length} component files`);

  console.log("📊 Analyzing components...");
  const components = componentFiles.map(analyzeComponent);

  // Calculate summary statistics
  const byCategory: Record<string, number> = {};
  const byReadiness: Record<string, number> = { ready: 0, notReady: 0 };
  const issuesSummary: Record<string, number> = {};

  for (const component of components) {
    // By category
    byCategory[component.category] = (byCategory[component.category] || 0) + 1;

    // By readiness
    if (component.migrationReady) byReadiness.ready++;
    else byReadiness.notReady++;

    // Issues summary
    for (const issue of component.issues) {
      issuesSummary[issue] = (issuesSummary[issue] || 0) + 1;
    }
  }

  const readinessScore = Math.round((byReadiness.ready / components.length) * 100);

  return {
    generated: new Date().toISOString(),
    version: "1.0.0",
    totalComponents: components.length,
    readinessScore,
    components,
    summary: {
      byCategory,
      byReadiness,
      issuesSummary,
    },
  };
}

/**
 * Main execution
 */
function main() {
  console.log("🚀 Component Manifest Generator\n");

  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error(`❌ Components directory not found: ${COMPONENTS_DIR}`);
    process.exit(1);
  }

  const manifest = generateManifest();

  console.log("\n📋 Manifest Summary:");
  console.log(`Total Components: ${manifest.totalComponents}`);
  console.log(`Readiness Score: ${manifest.readinessScore}%`);
  console.log(`Ready: ${manifest.summary.byReadiness.ready}`);
  console.log(`Not Ready: ${manifest.summary.byReadiness.notReady}`);

  console.log("\n📊 By Category:");
  for (const [category, count] of Object.entries(manifest.summary.byCategory)) {
    console.log(`  ${category}: ${count}`);
  }

  console.log("\n⚠️  Common Issues:");
  for (const [issue, count] of Object.entries(manifest.summary.issuesSummary)) {
    console.log(`  ${issue}: ${count}`);
  }

  const outputPath = path.join(process.cwd(), OUTPUT_FILE);
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Manifest written to: ${outputPath}`);

  // Also create a summary markdown report
  const mdOutputPath = outputPath.replace(".json", "-summary.md");
  const mdContent = generateMarkdownSummary(manifest);
  fs.writeFileSync(mdOutputPath, mdContent);
  console.log(`✅ Summary report written to: ${mdOutputPath}`);
}

/**
 * Generate a markdown summary report
 */
function generateMarkdownSummary(manifest: Manifest): string {
  const lines: string[] = [];

  lines.push("# Component Manifest Summary\n");
  lines.push(`**Generated:** ${manifest.generated}`);
  lines.push(`**Total Components:** ${manifest.totalComponents}`);
  lines.push(`**Readiness Score:** ${manifest.readinessScore}%\n`);

  lines.push("## Readiness Breakdown\n");
  lines.push(`- ✅ Ready for Migration: ${manifest.summary.byReadiness.ready}`);
  lines.push(`- ❌ Not Ready: ${manifest.summary.byReadiness.notReady}\n`);

  lines.push("## Components by Category\n");
  for (const [category, count] of Object.entries(manifest.summary.byCategory)) {
    lines.push(`- **${category}**: ${count} components`);
  }
  lines.push("");

  lines.push("## Common Issues\n");
  for (const [issue, count] of Object.entries(manifest.summary.issuesSummary)) {
    const percentage = Math.round((count / manifest.totalComponents) * 100);
    lines.push(`- **${issue}**: ${count} (${percentage}%)`);
  }
  lines.push("");

  lines.push("## Not Ready Components\n");
  const notReady = manifest.components.filter((c) => !c.migrationReady);
  for (const component of notReady.slice(0, 20)) {
    // First 20
    lines.push(`### ${component.name}`);
    lines.push(`**Path:** \`${component.path}\``);
    lines.push(`**Category:** ${component.category}`);
    lines.push(`**Issues:** ${component.issues.join(", ")}`);
    lines.push("");
  }

  if (notReady.length > 20) {
    lines.push(`\n*...and ${notReady.length - 20} more components*\n`);
  }

  lines.push("---");
  lines.push("\n**Next Steps:**");
  lines.push("1. Address common issues (missing tests, missing index files)");
  lines.push("2. Standardize component structure");
  lines.push("3. Re-run manifest generator to track progress");

  return lines.join("\n");
}

// Run the script
main();
