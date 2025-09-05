# Firebase Functions for CareerCopilot

This directory contains the Cloud Functions for Firebase that power the CareerCopilot backend services.

## Getting Started

### Prerequisites

- Node.js 20 or later
- Firebase CLI (`yarn global add firebase-tools`)
- Google Cloud SDK (for deployment)

### Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Copy the example environment file and update with your values:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your Firebase project details.

3. Build the project:
   ```bash
   yarn build
   ```

## Development

### Running Locally

Start the Firebase emulator suite:
```bash
yarn serve
```

This will start the Firebase emulator with your functions.

### Testing

Run the linter:
```bash
yarn lint
```

### Deployment

Deploy all functions:
```bash
npm run deploy
```

Deploy a specific function:
```bash
firebase deploy --only functions:functionName
```

## Environment Variables

- `GCLOUD_PROJECT`: Your Google Cloud project ID
- `FIREBASE_CONFIG`: Firebase configuration (auto-populated in production)
- `NODE_ENV`: Set to 'production' or 'development'

## Secret Management

Use Google Cloud Secret Manager for sensitive configuration:

1. Add a new secret:
   ```bash
   firebase functions:secrets:set SECRET_NAME
   ```

2. Access secrets in your code:
   ```typescript
   import { getSecret } from './utils/secretManager';

   const apiKey = await getSecret('API_KEY');
   ```

## Project Structure

- `src/`: TypeScript source files
  - `index.ts`: Main entry point that exports all functions
  - `utils/`: Utility functions and shared code
  - `functions/`: Individual function implementations
- `lib/`: Compiled JavaScript (do not edit directly)

## Best Practices

- Keep functions small and focused on a single responsibility
- Use TypeScript for type safety
- Follow the principle of least privilege for IAM permissions
- Implement proper error handling and logging
- Write tests for your functions

## Troubleshooting

- **Build errors**: Run `npm run build` to see TypeScript errors
- **Deployment issues**: Check logs with `firebase functions:log`
- **Authentication problems**: Ensure your Firebase CLI is logged in with `firebase login`

## License

UNLICENSED - See the main project LICENSE file for details.
