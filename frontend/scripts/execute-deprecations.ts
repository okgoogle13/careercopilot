import { Project } from 'ts-morph';
import * as path from 'path';
import { fileURLToPath } from 'url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(currentDir, '..');

// Deprecation Map
const DEPRECATION_MAP: Record<string, string> = {
  // '<OldName>': '<NewName>'
  PrimaryButton: 'KeralaRageButton',
  SecondaryButton: 'KeralaRageButton',
  OutlineButton: 'KeralaRageButton',
  BaseCard: 'SolidarityCard',
  InfoCard: 'SolidarityCard',
  FeatureCard: 'SolidarityCard',
  StandardLayout: 'AppShell',
  // Note: For a true migration, more specific regexes or AST manipulating would be needed.
};

function main() {
  console.log('Initializing Application AST...');
  const project = new Project({
    tsConfigFilePath: path.join(FRONTEND_DIR, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: false,
  });

  console.log('Finding and replacing deprecated component usage...');

  let changedFiles = 0;

  project.getSourceFiles().forEach((sf) => {
    const filePath = sf.getFilePath();
    if (filePath.includes('node_modules')) return;

    let text = sf.getFullText();
    let madeReplacements = false;

    for (const [oldName, newName] of Object.entries(DEPRECATION_MAP)) {
      // Safe replacement using word boundaries
      const regexImport = new RegExp(`import\\s+.*?\\b${oldName}\\b.*?\\s+from`, 'g');
      const regexJsxOpen = new RegExp(`<${oldName}\\b`, 'g');
      const regexJsxClose = new RegExp(`</${oldName}>`, 'g');

      const hasImport = regexImport.test(text);
      const hasJsxOpen = regexJsxOpen.test(text);
      const hasJsxClose = regexJsxClose.test(text);

      if (hasImport || hasJsxOpen || hasJsxClose) {
        // Reset lastIndex
        regexImport.lastIndex = 0;
        regexJsxOpen.lastIndex = 0;
        regexJsxClose.lastIndex = 0;

        text = text.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName);
        madeReplacements = true;
      }
    }

    if (madeReplacements) {
      sf.replaceWithText(text);
      sf.saveSync();
      changedFiles++;
      console.log(`Updated ${filePath}`);
    }
  });

  console.log(`\n✅ Finished executing deprecations. Modified ${changedFiles} files.`);
}

main();
