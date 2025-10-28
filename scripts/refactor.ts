import { Project, Node, SyntaxKind } from 'ts-morph';

interface RefactoringRule {
  name: string;
  condition: (node: Node) => boolean;
  action: (node: Node) => void;
}

const rules: RefactoringRule[] = [
  {
    name: 'Convert any to unknown',
    condition: (node) =>
      node.getKind() === SyntaxKind.AnyKeyword,
    action: (node) => {
      node.replaceWithText('unknown');
    }
  },
  {
    name: 'Convert String to string',
    condition: (node) =>
      node.getKind() === SyntaxKind.Identifier &&
      node.getText() === 'String' &&
      node.getParent()?.getKind() === SyntaxKind.TypeReference,
    action: (node) => {
      node.replaceWithText('string');
    }
  },
  {
    name: 'Convert Number to number',
    condition: (node) =>
      node.getKind() === SyntaxKind.Identifier &&
      node.getText() === 'Number' &&
      node.getParent()?.getKind() === SyntaxKind.TypeReference,
    action: (node) => {
      node.replaceWithText('number');
    }
  },
  {
    name: 'Convert Boolean to boolean',
    condition: (node) =>
      node.getKind() === SyntaxKind.Identifier &&
      node.getText() === 'Boolean' &&
      node.getParent()?.getKind() === SyntaxKind.TypeReference,
    action: (node) => {
      node.replaceWithText('boolean');
    }
  },
  // Add more rules as needed
];

function applyRefactoringRules(project: Project) {
  const sourceFiles = project.getSourceFiles();

  sourceFiles.forEach(sourceFile => {
    sourceFile.forEachDescendant(node => {
      for (const rule of rules) {
        if (rule.condition(node)) {
          rule.action(node);
        }
      }
    });
  });
}

// To run this, you would create a Project instance and call the function.
// For example:
//
// const project = new Project({
//   tsConfigFilePath: 'tsconfig.json',
// });
//
// applyRefactoringRules(project);
//
// project.save().then(() => {
//   console.log('Refactoring complete.');
// });
