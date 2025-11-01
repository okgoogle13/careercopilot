// scripts/migrate-tailwind.js
console.log('Starting Tailwind to MUI migration...');
console.log('This script will help you migrate Tailwind classes to MUI sx prop.');
console.log('Please make sure to backup your files before running this script.\n');

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask the user for the directory to process
rl.question('Enter the path to the directory to process (default: src/): ', (dirPath) => {
  const targetDir = dirPath || 'src/';
  console.log(`\nProcessing files in: ${path.resolve(targetDir)}`);
  
  // Find all .tsx and .jsx files
  const files = findFiles(targetDir, ['.tsx', '.jsx']);
  console.log(`Found ${files.length} files to process.`);
  
  // Process each file
  files.forEach(file => {
    console.log(`\nProcessing: ${file}`);
    processFile(file);
  });
  
  console.log('\nMigration complete!');
  rl.close();
});

// Function to find files with specific extensions
function findFiles(dir, extensions) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file === 'node_modules' || file === '.next') {
        return;
      }
      // Recursively search in subdirectories
      results = results.concat(findFiles(fullPath, extensions));
    } else {
      // Check if file has one of the target extensions
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  
  return results;
}

// Function to process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Simple example: Convert className="flex" to sx={{ display: 'flex' }}
    // This is a simplified example - you would expand this with more mappings
    if (content.includes('className="')) {
      content = content.replace(
        /className=\"([^\"]+)\"/g,
        (match, classes) => {
          modified = true;
          return `sx={{ ${convertClasses(classes)} }}`;
        }
      );
    }
    
    // Save the file if it was modified
    if (modified) {
      // Create a backup
      const backupPath = `${filePath}.bak`;
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
        console.log(`  🔄 Created backup: ${backupPath}`);
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ Updated: ${filePath}`);
    } else {
      console.log(`  ⏩ No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
  }
}

// Function to convert Tailwind classes to MUI sx props
function convertClasses(classes) {
  const classMap = {
    // Layout
    'flex': 'display: "flex"',
    'flex-col': 'flexDirection: "column"',
    'items-center': 'alignItems: "center"',
    'justify-center': 'justifyContent: "center"',
    // Add more mappings as needed
  };
  
  return classes.split(' ')
    .map(cls => classMap[cls] || `"${cls}": true /* TODO: Convert this class */`)
    .join(',\n      ');
}
