import path from "path";
import { Project, SyntaxKind } from "ts-morph";

const project = new Project();
const sourceFiles = project.addSourceFilesAtPaths("frontend/src/**/*.tsx");

const filesToUpdate = [
  "frontend/src/components/features/Documents/DocumentPreview.tsx",
  "frontend/src/components/features/opportunities/CareerGrowthHub.tsx",
  "frontend/src/components/features/profile/ProfileEditor.tsx",
];

console.log("Starting Phase 1.1: Fixing DialogContent children...");

let fixedFileCount = 0;

sourceFiles.forEach((sourceFile) => {
  const filePath = sourceFile.getFilePath();
  if (!filesToUpdate.some((f) => path.resolve(f) === path.resolve(filePath))) {
    return;
  }

  let changesMade = false;
  const dialogContentElements = sourceFile
    .getDescendantsOfKind(SyntaxKind.JsxElement)
    .filter((element) => {
      const openingElement = element.getOpeningElement();
      return openingElement.getTagName().getText() === "DialogContent";
    });

  dialogContentElements.forEach((element) => {
    const children = element.getJsxChildren();

    // Filter out whitespace-only text nodes
    const actualChildren = children.filter((child) => {
      if (child.getKind() === SyntaxKind.JsxText) {
        return child.getText().trim().length > 0;
      }
      return true;
    });

    if (actualChildren.length > 1) {
      console.log(
        `- Found multiple children in <DialogContent> in ${filePath}. Wrapping in fragment.`,
      );

      const childrenText = children.map((child) => child.getFullText()).join("");
      element.setBodyText(`\n<>\n${childrenText}\n</>\n`);
      changesMade = true;
    }
  });

  if (changesMade) {
    sourceFile.saveSync();
    fixedFileCount++;
    console.log(`✅ Fixed and saved: ${filePath}`);
  }
});

if (fixedFileCount > 0) {
  console.log(`\nPhase 1.1 complete. Fixed ${fixedFileCount} files.`);
  console.log("Run `npx tsc --noEmit` in the `frontend` directory to see the reduced error count.");
} else {
  console.log("\nPhase 1.1 complete. No files required changes for this specific issue.");
}
