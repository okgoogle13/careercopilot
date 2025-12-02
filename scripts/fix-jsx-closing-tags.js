#!/usr/bin/env node
/**
 * Fix JSX closing tag mismatches
 * Finds opening tags and ensures closing tags match
 */

const fs = require('fs');
const path = require('path');

const jsxTagRegex = /<(\w+)[^>]*>/g;
const closingTagRegex = /<\/(\w+)>/g;

function findMismatches(content) {
  const openingTags = [];
  const mismatches = [];
  let match;

  // Track opening tags
  const lines = content.split('\n');

  lines.forEach((line, lineNum) => {
    // Find all opening tags
    const openMatches = [...line.matchAll(/<(\w+)[^>]*>/g)];
    const closeMatches = [...line.matchAll(/<\/(\w+)>/g)];

    openMatches.forEach(m => {
      const tagName = m[1];
      if (!isSelfClosing(tagName)) {
        openingTags.push({ tag: tagName, line: lineNum, col: m.index });
      }
    });

    closeMatches.forEach(m => {
      const tagName = m[1];
      if (openingTags.length > 0) {
        const lastOpen = openingTags[openingTags.length - 1];
        if (lastOpen.tag !== tagName) {
          mismatches.push({
            expected: lastOpen.tag,
            found: tagName,
            line: lineNum,
            col: m.index,
            openLine: lastOpen.line
          });
        }
        openingTags.pop();
      }
    });
  });

  return mismatches;
}

function isSelfClosing(tag) {
  const selfClosing = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
  return selfClosing.includes(tag.toLowerCase());
}

function fixMismatchedTags(content) {
  // Common Electric component mismatches
  const fixes = [
    // ElectricButton mismatches
    { from: /<Button([^>]*)>[\s\S]*?<\/ElectricButton>/g, to: (match) => {
      const attrs = match.match(/<Button([^>]*)>/)[1];
      const innerContent = match.match(/>[\s\S]*?</)[0].slice(1, -1);
      return `<Button${attrs}>${innerContent}</Button>`;
    }},
    // ElectricCard mismatches
    { from: /<Card([^>]*)>[\s\S]*?<\/ElectricCard>/g, to: (match) => {
      const attrs = match.match(/<Card([^>]*)>/)[1];
      const innerContent = match.match(/>[\s\S]*?</)[0].slice(1, -1);
      return `<Card${attrs}>${innerContent}</Card>`;
    }},
    // ElectricAlert mismatches
    { from: /<Alert([^>]*)>[\s\S]*?<\/ElectricAlert>/g, to: (match) => {
      const attrs = match.match(/<Alert([^>]*)>/)[1];
      const innerContent = match.match(/>[\s\S]*?</)[0].slice(1, -1);
      return `<Alert${attrs}>${innerContent}</Alert>`;
    }},
    // ElectricContainer mismatches
    { from: /<Container([^>]*)>[\s\S]*?<\/ElectricContainer>/g, to: (match) => {
      const attrs = match.match(/<Container([^>]*)>/)[1];
      const innerContent = match.match(/>[\s\S]*?</)[0].slice(1, -1);
      return `<Container${attrs}>${innerContent}</Container>`;
    }},
  ];

  let result = content;

  // Simple fix: replace all </ElectricButton> with </Button>, etc.
  result = result.replace(/<\/ElectricButton>/g, '</Button>');
  result = result.replace(/<\/ElectricCard>/g, '</Card>');
  result = result.replace(/<\/ElectricAlert>/g, '</Alert>');
  result = result.replace(/<\/ElectricContainer>/g, '</Container>');
  result = result.replace(/<\/ElectricDialog>/g, '</Dialog>');
  result = result.replace(/<\/ElectricTabs>/g, '</Tabs>');
  result = result.replace(/<\/ElectricBreadcrumb>/g, '</Breadcrumb>');
  result = result.replace(/<\/ElectricDrawer>/g, '</Drawer>');
  result = result.replace(/<\/ElectricPopover>/g, '</Popover>');
  result = result.replace(/<\/ElectricTooltip>/g, '</Tooltip>');
  result = result.replace(/<\/ElectricInput>/g, '</Input>');
  result = result.replace(/<\/ElectricSelect>/g, '</Select>');
  result = result.replace(/<\/ElectricCheckbox>/g, '</Checkbox>');
  result = result.replace(/<\/ElectricSwitch>/g, '</Switch>');
  result = result.replace(/<\/ElectricRadioGroup>/g, '</RadioGroup>');
  result = result.replace(/<\/ElectricSlider>/g, '</Slider>');
  result = result.replace(/<\/ElectricProgress>/g, '</Progress>');
  result = result.replace(/<\/ElectricSkeleton>/g, '</Skeleton>');
  result = result.replace(/<\/ElectricAvatar>/g, '</Avatar>');
  result = result.replace(/<\/ElectricBadge>/g, '</Badge>');
  result = result.replace(/<\/ElectricPagination>/g, '</Pagination>');
  result = result.replace(/<\/ElectricDivider>/g, '</Divider>');
  result = result.replace(/<\/ElectricEmptyState>/g, '</EmptyState>');
  result = result.replace(/<\/ElectricGrid>/g, '</Grid>');
  result = result.replace(/<\/ElectricDatePicker>/g, '</DatePicker>');
  result = result.replace(/<\/ElectricSearchInput>/g, '</SearchInput>');
  result = result.replace(/<\/ElectricTextarea>/g, '</Textarea>');
  result = result.replace(/<\/ElectricTable>/g, '</Table>');
  result = result.replace(/<\/ElectricTableHeader>/g, '</TableHeader>');
  result = result.replace(/<\/ElectricTableBody>/g, '</TableBody>');
  result = result.replace(/<\/ElectricTableRow>/g, '</TableRow>');
  result = result.replace(/<\/ElectricTableHead>/g, '</TableHead>');
  result = result.replace(/<\/ElectricTableCell>/g, '</TableCell>');

  return result;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fixed = fixMismatchedTags(content);

    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf-8');
      console.log(`✓ Fixed: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
  }

  return false;
}

function processDirectory(dir) {
  let fixedCount = 0;

  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(file.name)) {
        fixedCount += processDirectory(fullPath);
      }
    } else if (file.name.match(/\.(tsx|jsx)$/)) {
      if (processFile(fullPath)) {
        fixedCount++;
      }
    }
  }

  return fixedCount;
}

const frontendDir = '/Applications/careercopilot/frontend/src';
console.log('Fixing JSX closing tag mismatches...\n');
const count = processDirectory(frontendDir);
console.log(`\n✅ Fixed ${count} files`);
