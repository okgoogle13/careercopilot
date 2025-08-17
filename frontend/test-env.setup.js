// Polyfill fetch in Node to support relative URLs (for MSW)
if (typeof window === 'undefined') {
  const origFetch = global.fetch;
  global.fetch = (url, ...args) => {
    if (typeof url === 'string' && url.startsWith('/')) {
      url = 'http://localhost' + url;
    }
    return origFetch(url, ...args);
  };
}
// frontend/test-env.setup.js
// This file sets up environment variables for testing

// Ensure jsdom is loaded before any other test setup
if (typeof window === 'undefined' || typeof document === 'undefined') {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
}
process.env.NODE_ENV = 'test';
process.env.VITEST = 'true';

// Polyfill fetch to support relative URLs in Node (for MSW)
if (typeof window === 'undefined') {
  const origFetch = global.fetch;
  global.fetch = (url, ...args) => {
    if (typeof url === 'string' && url.startsWith('/')) {
      // Use a dummy base URL so relative URLs work
      url = 'http://localhost' + url;
    }
    return origFetch(url, ...args);
  };
}

// Polyfill global document with jsdom in Node if missing
if (typeof document === 'undefined') {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
}

// Suppress React 18 console warnings during tests
console.error = (...args) => {
  // Filter out specific React warnings that might pollute test output
  const suppressed = [
    'Warning: ReactDOM.render is no longer supported',
    'Warning: useLayoutEffect does nothing on the server',
    'Warning: React.createElement: type is invalid',
    'Warning: The current testing environment is not configured to support act',
  ];
  
  if (typeof args[0] === 'string' && suppressed.some(w => args[0].includes(w))) {
    return;
  }
  
  // eslint-disable-next-line no-console
  console.warn(...args);
};

// Mock window.matchMedia if it doesn't exist (required for some UI components)
if (typeof window !== 'undefined') {
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
    };
  };
}
