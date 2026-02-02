// Utility functions for Playwright tests
export async function checkServerAvailability(page) {
  try {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
    const response = await fetch(baseURL, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export function skipIfServerUnavailable(testFunction, testName) {
  return async (args) => {
    const { page } = args;
    const serverAvailable = await checkServerAvailability(page);

    if (!serverAvailable) {
      console.log(
        `⚠️  Skipping test "${testName}" - Server not available at ${process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'}`
      );
      console.log(`   To run this test, start the dev server with: yarn dev`);
      return; // Skip the test
    }

    return testFunction(args);
  };
}
