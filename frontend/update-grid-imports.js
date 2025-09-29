const fs = require('fs');
const path = require('path');

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace import statements
    const updatedContent = content
      .replace(
        /import\s*\{\s*([^}]*\bGrid\b[^}]*)\}\s*from\s*['"]@mui\/material['"]/g,
        'import { $1 } from \'@mui/material/Unstable_Grid2\''
      )
      .replace(
        /import\s*\{\s*([^}]*),\s*Grid\s*,\s*([^}]*)\}\s*from\s*['"]@mui\/material['"]/g,
        'import { $1, $2 } from \'@mui/material\'\nimport { Grid } from \'@mui/material/Unstable_Grid2\''
      )
      .replace(
        /import\s*\{\s*Grid\s*,\s*([^}]*)\}\s*from\s*['"]@mui\/material['"]/g,
        'import { $1 } from \'@mui/material\'\nimport { Grid } from \'@mui/material/Unstable_Grid2\''
      );
    
    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.js')) {
      updateFile(fullPath);
    }
  });
}

// Start processing from the src directory
const srcDir = path.join(__dirname, 'src');
processDirectory(srcDir);

console.log('Grid imports updated successfully!');
