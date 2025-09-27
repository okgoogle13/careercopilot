# Integration Tests

This directory contains integration tests that test components with real external services.

## Firestore Integration Tests

The profile creation tests (`test_profile_creation.py`) use the **Firestore Emulator** to test user profile creation logic.

### Prerequisites

1. **Firestore Emulator**: Install the Google Cloud SDK and the Firestore emulator:

   ```bash
   # Install Google Cloud SDK
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL

   # Install Firestore emulator
   gcloud components install cloud-firestore-emulator
   ```

2. **Python Dependencies**: Ensure all required packages are installed:
   ```bash
   pip install -r requirements.txt
   pip install pytest pytest-asyncio
   ```

### Running the Tests

1. **Start the Firestore Emulator** (in a separate terminal):

   ```bash
   gcloud emulators firestore start --port=8080
   ```

2. **Run the integration tests**:

   ```bash
   # From the backend directory
   cd backend

   # Run all integration tests
   pytest app/tests/integration/ -v

   # Run only the profile creation tests
   pytest app/tests/integration/test_profile_creation.py -v

   # Run with coverage
   pytest app/tests/integration/test_profile_creation.py -v --cov=app.services.user_profile_service
   ```

### Test Structure

The `test_profile_creation.py` file contains comprehensive tests for:

- **Basic profile creation**: Testing core functionality with required fields
- **Extended profile creation**: Testing with additional custom fields
- **Minimal data scenarios**: Testing edge cases with minimal required data
- **Error handling**: Testing failure scenarios and error conditions
- **Multiple users**: Testing data isolation between different users
- **Timestamp validation**: Ensuring proper timestamp handling
- **Full workflow**: Testing create -> read operations

### Test Features

- **Firestore Emulator Integration**: Tests run against a local emulator, not production
- **Automatic Cleanup**: Each test automatically cleans up its test data
- **Real Firebase SDK**: Uses the actual Firebase Admin SDK with emulator configuration
- **Comprehensive Coverage**: Tests both service layer and direct Firestore validation

### Environment Variables

The tests automatically set these environment variables:

- `FIRESTORE_EMULATOR_HOST=localhost:8080`
- `GCLOUD_PROJECT=careercopilot-test`

### Troubleshooting

- **Emulator not running**: Ensure the Firestore emulator is started on port 8080
- **Permission errors**: The tests use mock credentials suitable for the emulator
- **Port conflicts**: If port 8080 is busy, change the port in both the emulator start command and the test configuration

### Adding New Integration Tests

When adding new integration tests:

1. Follow the naming convention: `test_*.py`
2. Use the `@pytest.mark.asyncio` decorator for async tests
3. Include proper setup/teardown with fixtures
4. Test both success and failure scenarios
5. Verify data both through the service layer and directly in the database
