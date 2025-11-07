// This is a test file to verify TypeScript types
import fs from 'fs';
import path from 'path';

// Test Node.js types
const testNodeTypes = () => {
  const filePath = path.join(__dirname, 'test.txt');
  fs.writeFileSync(filePath, 'test');
  return fs.readFileSync(filePath, 'utf-8');
};

export { testNodeTypes };
