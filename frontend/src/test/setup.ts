import '@testing-library/jest-dom';
<<<<<<< HEAD
=======
import { expect, afterEach } from 'vitest';
>>>>>>> restoration-KR-Rage-Figma-v2.0
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
    cleanup();
});
