// Utility functions for Playwright tests
export async function checkServerAvailability(page) {
  try {
    const response = await fetch('http://localhost:5173', { method: 'HEAD' });
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
        `⚠️  Skipping test "${testName}" - Development server not running on localhost:5173`
      );
      console.log(`   To run this test, start the dev server with: npm run dev`);
      return; // Skip the test
    }

    return testFunction(args);
  };
}
