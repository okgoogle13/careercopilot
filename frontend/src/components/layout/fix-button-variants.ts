import path from 'path';
import { Project, SyntaxKind } from 'ts-morph';

const project = new Project();
project.addSourceFilesAtPaths('frontend/src/**/*.tsx');

console.log('Starting Phase 5.2: Fixing Button variants and props...');

const variantMap: { [key: string]: string } = {
  default: 'contained',
  destructive: 'contained',
  secondary: 'outlined',
  ghost: 'text',
  link: 'text',
  outline: 'outlined',
};

let fixesMade = 0;

project.getSourceFiles().forEach((sourceFile) => {
  const filePath = sourceFile.getFilePath();
  let fileChanged = false;

  const buttonElements = sourceFile
    .getDescendantsOfKind(SyntaxKind.JsxOpeningElement)
    .filter((el) => el.getTagNameNode().getText() === 'Button');

  if (buttonElements.length === 0) return;

  // Determine which button is used in this file
  const muiButtonImport = sourceFile.getImportDeclaration('@mui/material');
  const isMuiButtonFile =
    muiButtonImport?.getNamedImports().some((ni) => ni.getName() === 'Button') ?? false;

  buttonElements.forEach((button) => {
    const variantAttr = button.getAttribute('variant');
    if (!variantAttr) return;

    const initializer = variantAttr.getInitializer();
    if (initializer && initializer.getKind() === SyntaxKind.StringLiteral) {
      const currentVariant = initializer.getLiteralText();

      if (isMuiButtonFile) {
        // This file uses MUI Button. We need to fix incorrect variants.
        if (variantMap[currentVariant]) {
          const newVariant = variantMap[currentVariant];
          console.log(
            `- In ${path.basename(filePath)} (MUI): Changing variant "${currentVariant}" to "${newVariant}"`
          );
          variantAttr.setInitializer(`"${newVariant}"`);
          fixesMade++;
          fileChanged = true;
        }
      } else {
        // This file likely uses the custom button. Let's check for MUI-style variants.
        if (['contained', 'text'].includes(currentVariant)) {
          const newVariant = currentVariant === 'contained' ? 'default' : 'ghost';
          console.log(
            `- In ${path.basename(filePath)} (Custom): Changing variant "${currentVariant}" to "${newVariant}"`
          );
          variantAttr.setInitializer(`"${newVariant}"`);
          fixesMade++;
          fileChanged = true;
        }
      }
    }
  });

  if (fileChanged) {
    sourceFile.saveSync();
    console.log(`  ✅ Fixed and saved ${path.basename(filePath)}`);
  }
});

if (fixesMade > 0) {
  console.log(`\nPhase 5.2 complete. Fixed ${fixesMade} button variants.`);
  console.log('I will now execute this script to apply the fixes.');
} else {
  console.log('\nPhase 5.2 complete. No button variants required changes.');
}
