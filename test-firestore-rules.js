/**
 * Firestore Security Rules Test Script
 *
 * This script tests the refactored Firestore security rules to ensure
 * proper user ownership validation and access controls.
 */

import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import fs from 'fs';

// Test scenarios for different user access patterns
const TEST_SCENARIOS = {
  // User ownership scenarios
  VALID_USER_ACCESS: {
    description: 'Authenticated user accessing their own data',
    uid: 'user123',
    path: '/users/user123',
    operation: 'read',
    expected: true
  },

  INVALID_USER_ACCESS: {
    description: 'Authenticated user accessing another user\'s data',
    uid: 'user123',
    path: '/users/user456',
    operation: 'read',
    expected: false
  },

  UNAUTHENTICATED_ACCESS: {
    description: 'Unauthenticated user trying to access data',
    uid: null,
    path: '/users/user123',
    operation: 'read',
    expected: false
  },

  // Subcollection scenarios
  VALID_DOCUMENT_ACCESS: {
    description: 'User accessing their own document',
    uid: 'user123',
    path: '/users/user123/documents/doc456',
    operation: 'write',
    expected: true
  },

  INVALID_DOCUMENT_ACCESS: {
    description: 'User accessing another user\'s document',
    uid: 'user123',
    path: '/users/user456/documents/doc789',
    operation: 'write',
    expected: false
  },

  // Global collections scenarios
  GLOBAL_OPPORTUNITIES_READ: {
    description: 'Authenticated user reading global opportunities',
    uid: 'user123',
    path: '/opportunities/opp123',
    operation: 'read',
    expected: true
  },

  GLOBAL_OPPORTUNITIES_WRITE: {
    description: 'Authenticated user writing global opportunities',
    uid: 'user123',
    path: '/opportunities/opp123',
    operation: 'write',
    expected: false
  },

  // Jobs collection scenarios
  JOBS_READ_AUTHENTICATED: {
    description: 'Authenticated user reading jobs',
    uid: 'user123',
    path: '/jobs/job456',
    operation: 'read',
    expected: true
  },

  JOBS_READ_UNAUTHENTICATED: {
    description: 'Unauthenticated user reading jobs',
    uid: null,
    path: '/jobs/job456',
    operation: 'read',
    expected: false
  },

  // Nested subcollection scenarios
  ANALYSIS_ACCESS_VALID: {
    description: 'User accessing their document analysis',
    uid: 'user123',
    path: '/users/user123/documents/doc456/analyses/analysis789',
    operation: 'read',
    expected: true
  },

  ANALYSIS_ACCESS_INVALID: {
    description: 'User accessing another user\'s document analysis',
    uid: 'user123',
    path: '/users/user456/documents/doc789/analyses/analysis123',
    operation: 'read',
    expected: false
  },

  // Default deny scenarios
  UNKNOWN_COLLECTION_ACCESS: {
    description: 'Accessing unknown collection (should be denied)',
    uid: 'user123',
    path: '/unknown_collection/doc123',
    operation: 'read',
    expected: false
  }
};

/**
 * Main test function
 */
async function runSecurityRulesTests() {
  console.log('🧪 Starting Firestore Security Rules Tests...\n');

  let testEnv;
  let passedTests = 0;
  let totalTests = 0;

  try {
    // Initialize test environment
    console.log('📋 Initializing test environment...');
    testEnv = await initializeTestEnvironment({
      projectId: 'test-project',
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8'),
        host: 'localhost',
        port: 8080
      }
    });
    console.log('✅ Test environment initialized\n');

    // Run each test scenario
    for (const [scenarioKey, scenario] of Object.entries(TEST_SCENARIOS)) {
      totalTests++;
      console.log(`📝 Test ${totalTests}: ${scenario.description}`);
      console.log(`   Path: ${scenario.path}`);
      console.log(`   Operation: ${scenario.operation}`);
      console.log(`   User: ${scenario.uid || 'unauthenticated'}`);
      console.log(`   Expected: ${scenario.expected ? 'ALLOW' : 'DENY'}`);

      try {
        // Create test context with authentication
        const context = scenario.uid
          ? testEnv.authenticatedContext(scenario.uid)
          : testEnv.unauthenticatedContext();

        // Get document reference
        const docRef = context.firestore().doc(scenario.path);

        // Attempt the operation
        let result;
        if (scenario.operation === 'read') {
          result = await docRef.get();
        } else if (scenario.operation === 'write') {
          result = await docRef.set({ testData: 'test' });
        } else if (scenario.operation === 'update') {
          result = await docRef.update({ testData: 'updated' });
        } else if (scenario.operation === 'delete') {
          result = await docRef.delete();
        }

        // If we reach here, the operation was allowed
        if (scenario.expected) {
          console.log('   ✅ PASS - Operation allowed as expected\n');
          passedTests++;
        } else {
          console.log('   ❌ FAIL - Operation was allowed but should have been denied\n');
        }

      } catch (error) {
        // Operation was denied
        if (!scenario.expected) {
          console.log('   ✅ PASS - Operation denied as expected\n');
          passedTests++;
        } else {
          console.log(`   ❌ FAIL - Operation was denied but should have been allowed`);
          console.log(`   Error: ${error.message}\n`);
        }
      }
    }

  } catch (error) {
    console.error('💥 Test setup failed:', error.message);
    return;
  } finally {
    // Clean up
    if (testEnv) {
      await testEnv.cleanup();
    }
  }

  // Print summary
  console.log('=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Security rules are working correctly.');
  } else {
    console.log(`\n⚠️  ${totalTests - passedTests} test(s) failed. Please review the rules.`);
    process.exit(1);
  }
}

/**
 * Validate rules functions implementation
 */
function validateRulesFunctions() {
  console.log('🔍 Validating reusable functions in firestore.rules...\n');

  const rulesContent = fs.readFileSync('firestore.rules', 'utf8');

  const expectedFunctions = [
    'function isOwner(userId)',
    'function isAuthenticated()',
    'function isDocumentOwner()',
    'function isRequestOwner()'
  ];

  console.log('📋 Checking for reusable functions:');

  expectedFunctions.forEach(func => {
    if (rulesContent.includes(func)) {
      console.log(`   ✅ Found: ${func}`);
    } else {
      console.log(`   ❌ Missing: ${func}`);
    }
  });

  // Check for usage of functions
  console.log('\n📋 Checking function usage:');

  const functionUsages = [
    { func: 'isOwner(userId)', count: (rulesContent.match(/isOwner\(userId\)/g) || []).length },
    { func: 'isAuthenticated()', count: (rulesContent.match(/isAuthenticated\(\)/g) || []).length },
    { func: 'isDocumentOwner()', count: (rulesContent.match(/isDocumentOwner\(\)/g) || []).length },
    { func: 'isRequestOwner()', count: (rulesContent.match(/isRequestOwner\(\)/g) || []).length }
  ];

  functionUsages.forEach(usage => {
    console.log(`   📊 ${usage.func}: used ${usage.count} times`);
  });

  // Calculate code reduction
  const originalPattern = 'request.auth != null && request.auth.uid == userId';
  const originalCount = (rulesContent.match(/request\.auth != null && request\.auth\.uid ==/g) || []).length;

  console.log(`\n📊 Code Reduction Analysis:`);
  console.log(`   Original pattern occurrences: ${originalCount}`);
  console.log(`   Replaced with reusable functions: ${originalCount === 0 ? '✅ All replaced' : '⚠️  Some remain'}`);

  console.log('\n✅ Rules function validation completed\n');
}

// Main execution
validateRulesFunctions();

console.log('To run full security tests, you need to:');
console.log('1. Install @firebase/rules-unit-testing: npm install --save-dev @firebase/rules-unit-testing');
console.log('2. Start Firestore emulator: firebase emulators:start --only firestore');
console.log('3. Run this script: node test-firestore-rules.js');
console.log('\nFor now, running rules validation only...\n');

export {
  runSecurityRulesTests,
  validateRulesFunctions,
  TEST_SCENARIOS
};