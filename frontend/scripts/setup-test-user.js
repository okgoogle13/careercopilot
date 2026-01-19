#!/usr/bin/env node

/**
 * Test User Setup Script
 *
 * This script creates a dedicated test user in Firebase Authentication
 * for use in E2E tests. Run this once before running tests.
 *
 * Usage:
 *   node scripts/setup-test-user.js
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });
console.log('Debug: API Key loaded:', process.env.VITE_FIREBASE_API_KEY ? 'Yes (starts with ' + process.env.VITE_FIREBASE_API_KEY.substring(0, 4) + ')' : 'No');

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@careercopilot.dev',
  password: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
  displayName: 'E2E Test User',
};

async function setupTestUser() {
  console.log('🔧 Setting up test user for E2E tests...\n');

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  try {
    // Try to sign in first (user might already exist)
    console.log(`Checking if test user exists: ${TEST_USER.email}`);
    await signInWithEmailAndPassword(auth, TEST_USER.email, TEST_USER.password);
    console.log('✅ Test user already exists and credentials are valid\n');

    console.log('Test User Details:');
    console.log('  Email:', TEST_USER.email);
    console.log('  Password:', TEST_USER.password);
    console.log(
      '\n⚠️  IMPORTANT: Keep these credentials secure and do not commit them to version control!\n'
    );
  } catch (signInError) {
    if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/wrong-password') {
      // User doesn't exist, create it
      console.log('Test user not found. Creating new test user...');

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          TEST_USER.email,
          TEST_USER.password
        );

        console.log('✅ Test user created successfully!\n');
        console.log('Test User Details:');
        console.log('  UID:', userCredential.user.uid);
        console.log('  Email:', TEST_USER.email);
        console.log('  Password:', TEST_USER.password);
        console.log(
          '\n⚠️  IMPORTANT: Keep these credentials secure and do not commit them to version control!\n'
        );

        console.log('📝 Next steps:');
        console.log('  1. Copy .env.test.example to .env.test');
        console.log('  2. Update TEST_USER_EMAIL and TEST_USER_PASSWORD in .env.test');
        console.log('  3. Run: yarn test:e2e\n');
      } catch (createError) {
        console.error('❌ Failed to create test user:', createError.message);
        process.exit(1);
      }
    } else {
      console.error('❌ Unexpected error:', signInError.message);
      process.exit(1);
    }
  }
}

setupTestUser().catch((error) => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
