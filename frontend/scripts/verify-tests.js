#!/usr/bin/env node

/**
 * This script verifies that all test files import necessary testing utilities
 * and have proper setup. It helps catch common testing issues early.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all test files
const testFiles = execSync('find src -name "*.test.ts*"', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean);

// Check each test file for proper imports
let hasErrors = false;
console.log('Checking test files for proper setup...');

testFiles.forEach(file => {
  const content = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
  
  // Check for describe, it, expect functions
  const hasTestingFunctions = 
    content.includes('describe(') || 
    content.includes('it(') || 
    content.includes('test(');
  
  // Check for React Testing Library imports for component tests
  const isComponentTest = file.includes('.tsx');
  const hasRtlImports = 
    isComponentTest && 
    (content.includes('@testing-library/react') || 
     content.includes('render('));
  
  if (!hasTestingFunctions) {
    console.error(`❌ ${file}: Missing testing functions (describe, it, test)`);
    hasErrors = true;
  }
  
  if (isComponentTest && !hasRtlImports) {
    console.error(`❌ ${file}: Component test missing React Testing Library imports`);
    hasErrors = true;
  }
  
  // Check if tests are actually implemented (not just boilerplate)
  if (!content.includes('expect(')) {
    console.warn(`⚠️ ${file}: No assertions found - test might be incomplete`);
  }

  // React components should mock router if using router components
  if (isComponentTest && 
      (content.includes('NavLink') || content.includes('useNavigate') || content.includes('Link')) && 
      !content.includes('vi.mock(\'react-router-dom\')') && 
      !content.includes('mockReactRouterDom')) {
    console.error(`❌ ${file}: Using router components without mocking react-router-dom or using mockReactRouterDom`);
    hasErrors = true;
  }
  
  // Check for 'any' types in test files
  if (content.includes(': any') || content.includes('as any')) {
    console.error(`❌ ${file}: Uses 'any' type - please use proper typing`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error('\n❌ Test verification failed. Please fix the issues above.');
  process.exit(1);
} else {
  console.log('\n✅ All test files passed verification checks!');
}
