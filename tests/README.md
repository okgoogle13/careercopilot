# Firebase Firestore Rules Testing

This directory contains unit tests for Firebase Firestore security rules using the Firebase Emulator Suite and Jest.

## Setup

### Prerequisites

1. **Firebase CLI**: Install the Firebase CLI globally

   ```bash
   npm install -g firebase-tools
   ```

2. **Java Runtime**: Firebase Emulator requires Java 11 or higher

   ```bash
   # Check if Java is installed
   java -version

   # On macOS with Homebrew
   brew install openjdk@11
   ```

### Installation

1. Install test dependencies:

   ```bash
   cd tests
   npm install
   ```

2. Initialize Firebase project (if not already done):
   ```bash
   cd ..
   firebase init firestore
   ```

## Running Tests

### Method 1: Automatic Emulator Management (Recommended)

The tests will automatically start and stop the Firestore emulator:

```bash
cd tests
npm test
```

### Method 2: Manual Emulator Management

1. Start the Firestore emulator in a separate terminal:

   ```bash
   firebase emulators:start --only firestore --project careercopilot-test
   ```

2. Run the tests:

   ```bash
   cd tests
   npm test
   ```

3. Stop the emulator:
   ```bash
   # Press Ctrl+C in the emulator terminal
   ```

### Additional Test Commands

```bash
# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Start emulator manually
npm run emulators:start

# Kill emulator processes
npm run emulators:kill
```

## Test Structure

### Test Files

- `firestore.rules.test.js` - Main test suite for Firestore security rules
- `jest.setup.js` - Jest configuration and setup
- `package.json` - Dependencies and test scripts

### Test Categories

#### 1. User Profiles Rules (`/users/{userId}`)

- ✅ Allow: User can read/write their own documents
- ❌ Deny: User cannot access other users' documents
- ❌ Deny: Unauthenticated users cannot access any user documents

#### 2. User Subcollections

- ✅ Allow: User can access their own subcollections (documents, profiles, settings, etc.)
- ❌ Deny: User cannot access other users' subcollections

#### 3. Global Collections

- ✅ Allow: Authenticated users can read global opportunities, jobs, templates, configurations
- ❌ Deny: Users cannot write to global collections (server-only)
- ❌ Deny: Unauthenticated users cannot read global collections

#### 4. Document Ownership Rules

- ✅ Allow: Users can read/write documents they own (via `userId` field)
- ❌ Deny: Users cannot access documents owned by others

#### 5. System Security

- ❌ Deny: All access to analytics collection
- ❌ Deny: Access to undefined collections (catch-all rule)

#### 6. Edge Cases

- Security scenarios and impersonation attempts
- Batch operations and performance tests
- Complex nested document access

## Test Scenarios Explained

### Scenario 1: User Profile Access (ALLOW)

```javascript
// User "user123" can read their own document at /users/user123
const db = getAuthContext("user123").firestore();
const userDoc = doc(db, "users", "user123");
await assertSucceeds(getDoc(userDoc)); // ✅ PASSES
```

### Scenario 2: Cross-User Access (DENY)

```javascript
// User "user123" cannot read another user's document at /users/anotherUser456
const db = getAuthContext("user123").firestore();
const otherUserDoc = doc(db, "users", "anotherUser456");
await assertFails(getDoc(otherUserDoc)); // ❌ FAILS (as expected)
```

## Firestore Rules Functions Tested

The tests validate these custom functions from `firestore.rules`:

- `isOwner(userId)` - Validates user ownership by comparing auth UID
- `isAuthenticated()` - Checks if user is authenticated
- `isDocumentOwner()` - Validates ownership from existing document data
- `isRequestOwner()` - Validates ownership from incoming request data

## Troubleshooting

### Common Issues

1. **Port already in use**

   ```
   Error: Port 8080 is already in use
   ```

   Solution: Kill existing emulator processes or use a different port

2. **Java not found**

   ```
   Error: Firebase emulators require Java
   ```

   Solution: Install Java 11 or higher

3. **Rules file not found**

   ```
   Error: Cannot read firestore.rules
   ```

   Solution: Ensure `firestore.rules` exists in the project root

4. **Tests timeout**
   ```
   Error: Timeout exceeded
   ```
   Solution: Increase timeout in `jest.setup.js` or check emulator connection

### Debug Mode

Run tests with detailed Firebase logs:

```bash
# Enable Firebase debug logs
export FIREBASE_EMULATOR_DEBUG=true
npm test
```

## CI/CD Integration

To integrate these tests into your CI/CD pipeline:

```yaml
# Example GitHub Actions step
- name: Run Firestore Rules Tests
  run: |
    cd tests
    npm install
    npm test
  env:
    FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## Security Best Practices Validated

These tests ensure your Firestore rules follow security best practices:

1. **Principle of Least Privilege**: Users can only access data they own
2. **Authentication Required**: No anonymous access to sensitive data
3. **Server-Only Operations**: Critical collections are write-protected
4. **Input Validation**: Ownership validation on both reads and writes
5. **Catch-All Denial**: Undefined paths are explicitly denied
6. **Defense in Depth**: Multiple layers of security validation
