import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, resolve } from "path";

// Function to process a single file
function processFile(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    let modified = false;
    let newContent = "";
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Check if this is a Grid item without a container parent
      if (
        line.trim().startsWith("<Grid item") &&
        !lines[i - 1]?.trim().includes("<Grid container")
      ) {
        console.log(`\nFound Grid item without container in ${filePath}:${i + 1}`);
        console.log(`  ${line}`);

        // Add container Grid
        const indent = line.match(/^\s*/)?.[0] || "";
        newContent += `${indent}<Grid container>\n${line}\n`;
        i++;

        // Add all content until the closing Grid tag
        while (i < lines.length && !lines[i].trim().startsWith("</Grid>")) {
          newContent += `${lines[i]}\n`;
          i++;
        }

        // Add the closing container Grid
        newContent += `${indent}</Grid>\n`;

        // Skip the original closing Grid tag
        if (i < lines.length && lines[i].trim() === "</Grid>") {
          console.log(`  Fixed Grid container wrapping at line ${i + 1}`);
          i++;
        }

        modified = true;
      } else {
        newContent += `${line}\n`;
        i++;
      }
    }

    if (modified) {
      writeFileSync(filePath, newContent);
      console.log(`✅ Fixed Grid components in ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return false;
  }
}

// Main function
function main() {
  console.log("🔍 Searching for files with Grid components...");

  // Find all TypeScript/TSX files that import Grid from @mui/material
  const findCmd = `find src -type f -name "*.tsx" -exec grep -l "from.*@mui/material/Grid" {} +`;
  const files = require("child_process")
    .execSync(findCmd, { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);

  console.log(`Found ${files.length} files with Grid components`);

  let fixedCount = 0;

  // Process each file
  files.forEach((file) => {
    const fullPath = resolve(process.cwd(), file);
    if (existsSync(fullPath)) {
      if (processFile(fullPath)) {
        fixedCount++;
      }
    }
  });

  console.log(`\n✨ Fix complete!`);
  console.log(`✅ Fixed ${fixedCount} of ${files.length} files`);
  console.log(`💡 Please review the changes before committing.`);
}

// Run the script
main();
