const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files to process
const filesToProcess = [
  'src/components/ui/accordion.tsx',
  'src/components/ui/alert-dialog.tsx',
  'src/components/ui/alert.tsx',
  // Add other files with import issues here
];

// Patterns to fix
const importPatterns = [
  // Remove version numbers from @radix-ui imports
  {
    pattern: /from '@radix-ui\/([^@]+)@[^']+'/g,
    replacement: "from '@radix-ui/$1'"
  },
  // Remove version numbers from lucide-react imports
  {
    pattern: /from 'lucide-react@[^']+'/g,
    replacement: "from 'lucide-react'"
  },
  // Fix next-themes import
  {
    pattern: /from 'next-themes@[^']+'/g,
    replacement: "from 'next-themes'"
  },
  // Fix sonner import
  {
    pattern: /from 'sonner@[^']+'/g,
    replacement: "from 'sonner'"
  },
  // Fix class-variance-authority import
  {
    pattern: /from 'class-variance-authority@[^']+'/g,
    replacement: "from 'class-variance-authority'"
  }
];

function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Apply all patterns
    importPatterns.forEach(({ pattern, replacement }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        modified = true;
        content = newContent;
      }
    });

    // Fix .tsx extension in imports
    const tsxPattern = /from '(\.{1,2}\/[^']+)\.tsx'/g;
    const tsxReplacement = "from '$1'";
    const newContent = content.replace(tsxPattern, tsxReplacement);
    if (newContent !== content) {
      modified = true;
      content = newContent;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed imports in ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Find all TypeScript/JavaScript files with import issues
function findFilesWithImportIssues() {
  try {
    // Find files with problematic imports
    const grepCmd = "grep -rE \"from '@(radix-ui|lucide-react|next-themes|sonner|class-variance-authority)[^']*@[^']*'\" --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' src/ || true";
    const result = execSync(grepCmd, { encoding: 'utf8' });

    const files = new Set();
    result.split('\n').forEach(line => {
      const match = line.match(/^(src\/.*?):/);
      if (match && match[1]) {
        files.add(match[1]);
      }
    });

    return Array.from(files);
  } catch (error) {
    console.error('Error finding files with import issues:', error);
    return [];
  }
}

// Main function
function main() {
  // Find files with import issues
  const filesWithIssues = findFilesWithImportIssues();
  const allFiles = [...new Set([...filesToProcess, ...filesWithIssues])];

  console.log(`Found ${allFiles.length} files to process`);

  // Fix imports in all files
  let fixedCount = 0;
  allFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      if (fixImports(fullPath)) {
        fixedCount++;
      }
    } else {
      console.log(`File not found: ${fullPath}`);
    }
  });

  console.log(`\nFixed imports in ${fixedCount} files`);

  // Fix case sensitivity issue with SkillTag.tsx
  const skillTagPath = path.join(process.cwd(), 'src/components/ui/SkillTag.tsx');
  const skillTagLowerPath = path.join(process.cwd(), 'src/components/ui/skilltag.tsx');

  if (fs.existsSync(skillTagPath) && !fs.existsSync(skillTagLowerPath)) {
    fs.renameSync(skillTagPath, skillTagLowerPath);
    console.log('Renamed SkillTag.tsx to skilltag.tsx for case sensitivity');
  }

  // Update imports that reference SkillTag with incorrect casing
  const skillTagImportPattern = /from '(\.{0,2}\/)*SkillTag'/g;
  const skillTagImportReplacement = "from './skilltag'";

  const filesWithSkillTagImport = execSync(
    "grep -rE \"from.*['\"]\.*[/]?SkillTag['\"]\" --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' src/ || true",
    { encoding: 'utf8' }
  );

  filesWithSkillTagImport.split('\n').forEach(line => {
    const match = line.match(/^(src\/.*?):/);
    if (match && match[1]) {
      const filePath = path.join(process.cwd(), match[1]);
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        const newContent = content.replace(skillTagImportPattern, skillTagImportReplacement);
        if (newContent !== content) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log(`Fixed SkillTag import in ${filePath}`);
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
      }
    }
  });
}

// Run the script
main();
