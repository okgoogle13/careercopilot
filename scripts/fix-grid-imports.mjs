import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Process a single file to fix Grid component issues
 * @param {string} filePath - Path to the file to process
 * @returns {boolean} Whether the file was modified
 */
function processFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let modified = false;
    let newContent = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Check if this is a Grid item without a container parent
      if (line.trim().startsWith('<Grid item') &&
          (i === 0 || !lines[i-1]?.trim().includes('<Grid container'))) {
        console.log(`\n🔧 Found Grid item without container in ${filePath}:${i+1}`);
        console.log(`   ${line.trim()}`);

        // Add container Grid
        const indent = line.match(/^\s*/)?.[0] || '';
        newContent.push(`${indent}<Grid container>`);
        newContent.push(line);
        i++;

        // Find the matching closing tag
        let depth = 1;
        while (i < lines.length && depth > 0) {
          const currentLine = lines[i];
          if (currentLine.includes('<Grid')) depth++;
          if (currentLine.includes('</Grid>')) depth--;

          if (depth > 0) {
            newContent.push(currentLine);
            i++;
          }
        }

        // Add the closing container Grid
        newContent.push(`${indent}</Grid>`);

        // Skip the original closing Grid tag
        if (i < lines.length && lines[i].trim() === '</Grid>') {
          console.log(`   Fixed Grid container wrapping at line ${i+1}`);
          i++;
        }

        modified = true;
      } else {
        newContent.push(line);
        i++;
      }
    }

    if (modified) {
      writeFileSync(filePath, newContent.join('\n'));
      console.log(`✅ Fixed Grid components in ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔍 Searching for files with Grid components...');

  try {
    // Find all TypeScript/TSX files that import Grid from @mui/material
    const findCmd = 'find frontend/src -type f -name "*.tsx" -exec grep -l "from.*@mui/material/Grid" {} +';
    const files = execSync(findCmd, { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);

    console.log(`Found ${files.length} files with Grid components`);

    let fixedCount = 0;

    // Process each file
    for (const file of files) {
      const fullPath = path.resolve(process.cwd(), file);
      if (existsSync(fullPath)) {
        if (processFile(fullPath)) {
          fixedCount++;
        }
      }
    }

    console.log(`\n✨ Fix complete!`);
    console.log(`✅ Fixed ${fixedCount} of ${files.length} files`);
    console.log(`💡 Please review the changes before committing.`);
  } catch (error) {
    console.error('❌ Error finding files:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
