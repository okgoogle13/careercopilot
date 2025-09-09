# Firebase Configuration Guide - CareerCopilot

## Overview
This document outlines the Firebase configuration requirements for the CareerCopilot application.

## Required Environment Variables

All Firebase environment variables must be prefixed with `VITE_` for Vite bundler compatibility:

| Variable | Required | Description | Format |
|----------|----------|-------------|--------|
| `VITE_FIREBASE_API_KEY` | ✅ | Web API key for Firebase services | `AIzaSy...` (~39 chars) |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | Authentication domain | `project-id.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | Firebase project identifier | `project-id` (lowercase) |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | Cloud Storage bucket | `project-id.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Cloud Messaging sender ID | `123456789012` (numeric) |
| `VITE_FIREBASE_APP_ID` | ✅ | Firebase app identifier | `1:123456:web:abcdef...` |

## Configuration Validation

The `firebase-config.ts` file includes built-in validation that:

1. **Checks for missing variables** - Throws error if any required env var is missing
2. **Validates against demo values** - Prevents deployment with placeholder/demo keys
3. **Provides detailed error messages** - Clear guidance on configuration issues
4. **Logs initialization status** - Console feedback for debugging

## Firebase Services Initialized

- **Firebase App** - Core Firebase application instance
- **Firebase Auth** - Authentication service for user management
- **Firestore Database** - NoSQL database for application data

## Error Handling

Configuration errors will throw descriptive messages:

```
Missing required Firebase environment variables: VITE_FIREBASE_API_KEY, VITE_FIREBASE_APP_ID
Please check your .env file and ensure all Firebase configuration variables are set.
```

```
Invalid Firebase configuration detected for: apiKey
Please update your .env file with real Firebase credentials.
```

## Setup Instructions

### 1. Get Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Scroll to "Your apps" section
5. Click "Config" under Firebase SDK snippet
6. Copy the configuration values

### 2. Create Environment File
1. Copy `.env.example` to `.env`
2. Replace placeholder values with real Firebase credentials
3. Ensure no demo/placeholder values remain

### 3. Verify Configuration
1. Start the development server: `npm run dev`
2. Check browser console for Firebase initialization messages
3. Verify no configuration errors appear

## Security Best Practices

1. **Never commit `.env` files** with real credentials
2. **Use separate projects** for dev/staging/production
3. **Configure Firebase security rules** appropriately
4. **Set up authentication** before deploying
5. **Monitor usage** and set billing alerts

## Troubleshooting

### Common Issues

**400 Bad Request Errors**
- Cause: Firebase Authentication not enabled in console
- Solution: Enable Auth in Firebase Console > Authentication

**Configuration Not Found**
- Cause: Missing or invalid environment variables
- Solution: Check `.env` file exists and has correct values

**Demo Key Errors**
- Cause: Using placeholder/demo API keys
- Solution: Replace with real Firebase credentials

### Environment Variable Debug

Add to your `.env` for debugging:
```
VITE_DEBUG_FIREBASE=true
```

This enables additional console logging for configuration validation.

## Production Deployment

1. **Set environment variables** in your hosting platform
2. **Enable Firebase services** (Auth, Firestore) in console
3. **Configure security rules** for production
4. **Test authentication flow** before launch
5. **Monitor errors** and usage after deployment

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)

For application-specific issues:
- Check browser console for detailed error messages
- Verify environment variable configuration
- Test with the debug tools available at `/debug.html`
