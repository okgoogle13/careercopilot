# 🔒 Secure Environment Setup Guide

## ⚠️ CRITICAL SECURITY NOTICE

**The exposed Firebase credentials have been removed and secured.**

## Environment Setup Instructions

### 1. Create Environment File

Copy the example environment file and configure with your credentials:

```bash
# Navigate to frontend directory
cd frontend/

# Copy the example file
cp .env.example .env

# Edit with your Firebase credentials
# NEVER commit the .env file to version control
```

### 2. Firebase Project Setup

For **PRODUCTION SECURITY**, use separate Firebase projects for each environment:

#### Development Environment
- Project: `careercopilot-dev`
- Use development-specific API keys
- Less restrictive security rules for testing

#### Staging Environment  
- Project: `careercopilot-staging`
- Use staging-specific API keys
- Production-like security rules

#### Production Environment
- Project: `careercopilot-prod`
- Use production-specific API keys
- Strict security rules

### 3. Firebase Configuration

Get your Firebase configuration from:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Project Settings → General → Your apps
4. Click "Config" for your web app
5. Copy the configuration values

### 4. Environment Variables Required

```env
# Firebase Configuration (Get from Firebase Console)
VITE_FIREBASE_API_KEY=AIzaSy... (starts with AIzaSy)
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

## 🔐 Security Best Practices

### Environment File Security
- ✅ **NEVER** commit `.env` files to version control
- ✅ Use different credentials for dev/staging/production
- ✅ Regularly rotate API keys
- ✅ Use least-privilege access principles

### Firebase Security Rules
Review and update your Firestore security rules:

```javascript
// Example secure rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### API Security
- Enable Firebase App Check for API protection
- Set up Firebase Security Rules monitoring
- Implement rate limiting where appropriate
- Use HTTPS-only in production

## 🚨 If Credentials Were Exposed

If Firebase credentials were ever committed to version control:

### Immediate Actions:
1. **Rotate all Firebase API keys immediately**
2. **Review Firebase audit logs** for unauthorized access
3. **Update security rules** to be more restrictive
4. **Monitor for suspicious activity**

### Firebase Console → Project Settings → Service Accounts:
- Generate new private keys
- Delete old compromised keys
- Update all deployment environments

## 📋 Security Checklist

### Before Deployment:
- [ ] Environment variables configured correctly
- [ ] No credentials in source code
- [ ] Firebase security rules reviewed and tested
- [ ] HTTPS redirect enabled
- [ ] Security headers configured
- [ ] Firebase App Check enabled (recommended)

### After Deployment:
- [ ] Monitor Firebase usage and billing
- [ ] Set up Firebase alerts for unusual activity
- [ ] Regular security rule audits
- [ ] Credential rotation schedule established

## 🔧 Development Workflow

### Local Development:
```bash
# 1. Copy environment template
cp frontend/.env.example frontend/.env

# 2. Edit with development Firebase credentials
nano frontend/.env

# 3. Start development server
cd frontend/
npm run dev
```

### Staging Deployment:
- Use staging Firebase project
- Staging-specific environment variables
- Test security rules in staging environment

### Production Deployment:
- Use production Firebase project
- Production environment variables
- Strict security rules
- Enable all security features

## 📞 Support

If you need help with Firebase setup or security configuration:
1. Check Firebase Documentation
2. Review Firebase Security Rules guide  
3. Test security rules in Firebase Console simulator

---
**Security is everyone's responsibility. Always follow secure coding practices.**