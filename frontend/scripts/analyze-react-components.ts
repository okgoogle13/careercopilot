#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  Node,
  Project,
  SourceFile,
  SyntaxKind,
  type FunctionDeclaration,
  type FunctionExpression,
  type ArrowFunction,
  type VariableDeclaration,
  type Symbol as MorphSymbol,
} from 'ts-morph';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FRONTEND_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(FRONTEND_DIR, 'src');
const OUTPUT_DIR = path.join(FRONTEND_DIR, 'analysis');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'react-components-snapshot.json');

type Bucket = 'screens' | 'features' | 'pages' | 'components';
type ExportKind = 'default' | 'named';

interface ComponentSnapshot {
  name: string;
  exportKind: ExportKind;
  props: Record<string, string>;
  isLikelyPageOrScreen: boolean;
}

interface FileSnapshot {
  path: string;
  bucket: Bucket;
  components: ComponentSnapshot[];
}

interface BucketSummary {
  files: number;
  components: number;
  likelyPagesOrScreens: number;
}

interface SnapshotReport {
  generatedAt: string;
  root: 'src';
  files: FileSnapshot[];
  summary: {
    byBucket: Record<Bucket, BucketSummary>;
  };
}

type FunctionLikeComponent = FunctionDeclaration | FunctionExpression | ArrowFunction;

function normalizePath(value: string): string {
  return value.split(path.sep).join('/');
}

function getBucketFromRelativePath(relativePath: string): Bucket | null {
  if (relativePath.startsWith('src/screens/')) return 'screens';
  if (relativePath.startsWith('src/features/')) return 'features';
  if (relativePath.startsWith('src/pages/')) return 'pages';
  if (relativePath.startsWith('src/components/')) return 'components';
  return null;
}

function isIgnoredFile(filePath: string): boolean {
  const normalized = normalizePath(filePath);
  return (
    !normalized.endsWith('.tsx') ||
    normalized.includes('/node_modules/') ||
    normalized.endsWith('.test.tsx') ||
    normalized.endsWith('.spec.tsx') ||
    normalized.endsWith('.stories.tsx')
  );
}

function isLikelyPageOrScreen(pathFromSrc: string): boolean {
  return (
    pathFromSrc.startsWith('pages/') ||
    pathFromSrc.startsWith('screens/') ||
    /^features\/.+\/index\.tsx$/.test(pathFromSrc)
  );
}

function isMemoOrForwardRefCall(node: Node): boolean {
  if (!Node.isCallExpression(node)) return false;
  const calleeText = node.getExpression().getText();
  return (
    calleeText === 'memo' ||
    calleeText === 'forwardRef' ||
    calleeText === 'React.memo' ||
    calleeText === 'React.forwardRef'
  );
}

function returnsJsxFromExpression(node: Node | undefined): boolean {
  if (!node) return false;
  if (Node.isJsxElement(node) || Node.isJsxSelfClosingElement(node) || Node.isJsxFragment(node)) {
    return true;
  }

  if (
    Node.isParenthesizedExpression(node) ||
    Node.isAsExpression(node) ||
    Node.isTypeAssertion(node)
  ) {
    return returnsJsxFromExpression(node.getExpression());
  }

  if (isMemoOrForwardRefCall(node) && Node.isCallExpression(node)) {
    const firstArg = node.getArguments()[0];
    if (firstArg && (Node.isArrowFunction(firstArg) || Node.isFunctionExpression(firstArg))) {
      return functionReturnsJsx(firstArg as FunctionLikeComponent);
    }
  }

  return false;
}

function functionReturnsJsx(fn: FunctionLikeComponent): boolean {
  if (Node.isArrowFunction(fn) && !Node.isBlock(fn.getBody())) {
    return returnsJsxFromExpression(fn.getBody());
  }

  const body = fn.getBody();
  if (!body || !Node.isBlock(body)) return false;

  const returnStatements = body.getDescendantsOfKind(SyntaxKind.ReturnStatement);
  return returnStatements.some((stmt) => returnsJsxFromExpression(stmt.getExpression()));
}

function getFunctionLikeFromVariableDeclaration(
  declaration: VariableDeclaration
): FunctionLikeComponent | null {
  const initializer = declaration.getInitializer();
  if (!initializer) return null;

  if (Node.isArrowFunction(initializer) || Node.isFunctionExpression(initializer)) {
    return initializer;
  }

  if (isMemoOrForwardRefCall(initializer) && Node.isCallExpression(initializer)) {
    const firstArg = initializer.getArguments()[0];
    if (firstArg && (Node.isArrowFunction(firstArg) || Node.isFunctionExpression(firstArg))) {
      return firstArg as FunctionLikeComponent;
    }
  }

  return null;
}

function getPropertyTypeText(symbol: MorphSymbol, contextNode: Node): string {
  const declaration = symbol.getValueDeclaration() ?? symbol.getDeclarations()[0];
  if (!declaration) {
    return symbol.getTypeAtLocation(contextNode).getText(contextNode);
  }
  return declaration.getType().getText(contextNode);
}

function extractPropsFromFunction(fn: FunctionLikeComponent): Record<string, string> {
  const params = fn.getParameters();
  if (params.length === 0) return {};

  const param = params[0];
  const propsType = param.getType();
  const nameNode = param.getNameNode();

  try {
    if (Node.isObjectBindingPattern(nameNode)) {
      const result: Record<string, string> = {};
      const propertySymbols = new Map(
        propsType.getProperties().map((symbol) => [symbol.getName(), symbol])
      );

      for (const element of nameNode.getElements()) {
        const localName = element.getName();
        const propertyNameNode = element.getPropertyNameNode();
        const sourceName = propertyNameNode ? propertyNameNode.getText() : localName;
        const propertySymbol = propertySymbols.get(sourceName);

        if (propertySymbol) {
          result[localName] = getPropertyTypeText(propertySymbol, param);
        } else {
          const elementType = element.getType();
          result[localName] = elementType.getText(param);
        }
      }

      return result;
    }

    if (Node.isIdentifier(nameNode)) {
      const properties = propsType.getProperties();
      if (properties.length === 0) return {};

      const result: Record<string, string> = {};
      for (const property of properties) {
        result[property.getName()] = getPropertyTypeText(property, param);
      }
      return result;
    }
  } catch {
    return {};
  }

  return {};
}

function getComponentName(
  declaration: FunctionDeclaration | VariableDeclaration,
  exportKind: ExportKind,
  sourceFile: SourceFile
): string {
  if (Node.isFunctionDeclaration(declaration)) {
    return (
      declaration.getName() ??
      (exportKind === 'default' ? sourceFile.getBaseNameWithoutExtension() : 'Anonymous')
    );
  }
  return declaration.getName();
}

function extractComponentSnapshot(
  declaration: FunctionDeclaration | VariableDeclaration,
  exportKind: ExportKind,
  pathFromSrc: string,
  sourceFile: SourceFile
): ComponentSnapshot | null {
  if (Node.isFunctionDeclaration(declaration)) {
    if (!functionReturnsJsx(declaration)) return null;
    return {
      name: getComponentName(declaration, exportKind, sourceFile),
      exportKind,
      props: extractPropsFromFunction(declaration),
      isLikelyPageOrScreen: isLikelyPageOrScreen(pathFromSrc),
    };
  }

  const functionLike = getFunctionLikeFromVariableDeclaration(declaration);
  if (!functionLike || !functionReturnsJsx(functionLike)) return null;

  return {
    name: getComponentName(declaration, exportKind, sourceFile),
    exportKind,
    props: extractPropsFromFunction(functionLike),
    isLikelyPageOrScreen: isLikelyPageOrScreen(pathFromSrc),
  };
}

function collectFileSnapshot(sourceFile: SourceFile): FileSnapshot | null {
  const absolutePath = sourceFile.getFilePath();
  const relativeToFrontend = normalizePath(path.relative(FRONTEND_DIR, absolutePath));
  const bucket = getBucketFromRelativePath(relativeToFrontend);

  if (!bucket) return null;

  const pathFromSrc = normalizePath(path.relative(SRC_DIR, absolutePath));
  const exportedDeclarations = sourceFile.getExportedDeclarations();
  const components: ComponentSnapshot[] = [];
  const seen = new Set<string>();

  exportedDeclarations.forEach((declarations, exportName) => {
    const exportKind: ExportKind = exportName === 'default' ? 'default' : 'named';

    for (const declaration of declarations) {
      let target: FunctionDeclaration | VariableDeclaration | null = null;

      if (Node.isFunctionDeclaration(declaration) || Node.isVariableDeclaration(declaration)) {
        target = declaration;
      } else if (Node.isFunctionExpression(declaration) || Node.isArrowFunction(declaration)) {
        const variableDecl = declaration.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
        if (variableDecl) target = variableDecl;
      }

      if (!target) continue;

      const snapshot = extractComponentSnapshot(target, exportKind, pathFromSrc, sourceFile);
      if (!snapshot) continue;

      const key = `${snapshot.name}:${snapshot.exportKind}`;
      if (seen.has(key)) continue;
      seen.add(key);
      components.push(snapshot);
    }
  });

  return {
    path: pathFromSrc,
    bucket,
    components: components.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

function createEmptySummary(): Record<Bucket, BucketSummary> {
  return {
    screens: { files: 0, components: 0, likelyPagesOrScreens: 0 },
    features: { files: 0, components: 0, likelyPagesOrScreens: 0 },
    pages: { files: 0, components: 0, likelyPagesOrScreens: 0 },
    components: { files: 0, components: 0, likelyPagesOrScreens: 0 },
  };
}

function analyzeReactComponents(): SnapshotReport {
  console.log('Initializing TypeScript project...');

  const originalCwd = process.cwd();
  process.chdir(__dirname);
  const project = new Project({
    tsConfigFilePath: '../tsconfig.json',
  });
  process.chdir(originalCwd);

  const files = project
    .getSourceFiles()
    .filter((sourceFile) => {
      const filePath = sourceFile.getFilePath();
      if (isIgnoredFile(filePath)) return false;
      const relative = normalizePath(path.relative(FRONTEND_DIR, filePath));
      return (
        relative.startsWith('src/screens/') ||
        relative.startsWith('src/features/') ||
        relative.startsWith('src/pages/') ||
        relative.startsWith('src/components/')
      );
    })
    .sort((a, b) => a.getFilePath().localeCompare(b.getFilePath()));

  console.log(`Analyzing ${files.length} TSX files...`);

  const snapshots: FileSnapshot[] = [];
  const summary = createEmptySummary();

  for (const sourceFile of files) {
    try {
      const snapshot = collectFileSnapshot(sourceFile);
      if (!snapshot) continue;

      snapshots.push(snapshot);
      summary[snapshot.bucket].files += 1;
      summary[snapshot.bucket].components += snapshot.components.length;
      summary[snapshot.bucket].likelyPagesOrScreens += snapshot.components.filter(
        (component) => component.isLikelyPageOrScreen
      ).length;
    } catch (error) {
      const relativePath = normalizePath(path.relative(FRONTEND_DIR, sourceFile.getFilePath()));
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Warning: failed to analyze ${relativePath}: ${message}`);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    root: 'src',
    files: snapshots,
    summary: {
      byBucket: summary,
    },
  };
}

function main() {
  const report = analyzeReactComponents();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8');

  console.log(`React component snapshot written to ${OUTPUT_PATH}`);
}

main();
