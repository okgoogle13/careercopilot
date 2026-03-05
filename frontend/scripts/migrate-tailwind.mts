// scripts/process-tailwind.mts
import fs from 'fs/promises';
import path from 'path';
import fg from 'fast-glob';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target directory
const TARGET_DIR = path.join(__dirname, '..', 'src');

// Find all files matching the given extensions
async function findFiles(dir: string, extensions: string[]): Promise<string[]> {
  const patterns = extensions.map((ext) => `**/*${ext}`);
  const files = await fg(patterns, {
    cwd: dir,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**'],
  });
  return files;
}

// Process a single file
async function processFile(filePath: string): Promise<boolean> {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let modified = false;

    // Simple conversion example - you can expand this
    if (content.includes('className="')) {
      content = content.replace(/className="([^"]+)"/g, (match, classes) => {
        modified = true;
        return `sx={{ /* Converted from: ${classes} */ }}`;
      });
    }

    if (modified) {
      // Create backup
      const backupPath = `${filePath}.bak`;
      try {
        await fs.access(backupPath);
        console.log(`  🔄 Backup exists: ${backupPath}`);
      } catch {
        await fs.copyFile(filePath, backupPath);
        console.log(`  🔄 Created backup: ${backupPath}`);
      }

      await fs.writeFile(filePath, content, 'utf8');
      console.log(`  ✅ Updated: ${filePath}`);
      return true;
    }

    console.log(`  ⏩ No changes needed: ${filePath}`);
    return false;
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting Tailwind to MUI migration...');
  console.log(`🔍 Processing files in: ${TARGET_DIR}`);

  try {
    const files = await findFiles(TARGET_DIR, ['.tsx', '.jsx']);
    console.log(`📋 Found ${files.length} files to process.`);

    if (files.length === 0) {
      console.log('❌ No files found to process.');
      return;
    }

    console.log('\n🔄 Starting migration...\n');

    // Process each file
    let processed = 0;
    let modified = 0;

    for (const file of files) {
      console.log(`📄 Processing: ${path.relative(process.cwd(), file)}`);
      const wasModified = await processFile(file);
      if (wasModified) modified++;
      processed++;

      // Show progress
      console.log(
        `   Progress: ${processed}/${files.length} (${Math.round((processed / files.length) * 100)}%)`
      );
    }

    // Show summary
    console.log('\n🎉 Migration complete!');
    console.log(`📊 Processed: ${processed} files`);
    console.log(`🔄 Modified: ${modified} files`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
