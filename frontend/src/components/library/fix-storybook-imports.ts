import { Project, SyntaxKind, ImportDeclaration, SourceFile, ImportSpecifier } from 'ts-morph';
import path from 'path';

const project = new Project();
project.addSourceFilesAtPaths('frontend/src/**/*.stories.tsx');

console.log('Starting Phase 2: Fixing Storybook type imports...');

let changesMade = 0;

const filesToUpdate = [
  'frontend/src/components/documents/__stories__/DocumentBrowser.stories.tsx',
  'frontend/src/components/layout/AppLayout.stories.tsx',
  'frontend/src/components/layout/PageHeader.stories.tsx',
  'frontend/src/components/ui/Button/Button.stories.tsx',
];

project.getSourceFiles().forEach((sourceFile: SourceFile) => {
  const filePath = sourceFile.getFilePath();
  if (!filesToUpdate.some((f) => path.resolve(f) === path.resolve(filePath))) {
    return;
  }

  const storybookImport = sourceFile.getImportDeclaration('@storybook/react');

  if (storybookImport && !storybookImport.isTypeOnly()) {
    const importSpecifiers = storybookImport.getNamedImports().map((ni: ImportSpecifier) => ni.getName());
    if (importSpecifiers.includes('Meta') || importSpecifiers.includes('StoryObj')) {
      console.log(
        `- Found incorrect Storybook import in ${path.basename(filePath)}. Adding 'type'.`
      );
      storybookImport.setIsTypeOnly(true);
      changesMade++;
    }
  }
});

if (changesMade > 0) {
  project.saveSync();
  console.log(`\n✅ Phase 2 complete. Fixed and saved ${changesMade} files.`);
  console.log('I will now execute this script to apply the fixes.');
} else {
  console.log('\nPhase 2 complete. No files required changes for this specific issue.');
}
