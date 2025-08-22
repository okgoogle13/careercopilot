# 🔐 Google OAuth Setup Guide for CareerCopilot

Quick reference for configuring Google OAuth authentication in both staging and production environments.

## 🚀 **Automated Setup (Recommended)**

```bash
./scripts/setup-google-oauth.sh
```

This script will:
- ✅ Enable required Google APIs
- ✅ Guide you through OAuth consent screen setup
- ✅ Help create OAuth clients with correct URLs
- ✅ Add client IDs to GitHub secrets

## 📋 **Manual Configuration URLs**

### **📊 Staging Environment**

**Project**: `careercopilot-staging`

**JavaScript Origins**:
```
https://careercopilot-staging.web.app
https://careercopilot-staging.firebaseapp.com
http://localhost:5173
http://localhost:3000
```

**Authorized Redirect URIs**:
```
https://careercopilot-staging.web.app/__/auth/handler
https://careercopilot-staging.firebaseapp.com/__/auth/handler
http://localhost:5173/__/auth/handler
http://localhost:3000/__/auth/handler
```

### **🚀 Production Environment**

**Project**: `careercopilot-468811`

**JavaScript Origins**:
```
https://careercopilot-468811.web.app
https://careercopilot-468811.firebaseapp.com
```

**Authorized Redirect URIs**:
```
https://careercopilot-468811.web.app/__/auth/handler
https://careercopilot-468811.firebaseapp.com/__/auth/handler
```

## 🛠️ **Manual Setup Steps**

### **1. OAuth Consent Screen**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (staging or production)
3. Navigate to: **APIs & Services** → **OAuth consent screen**
4. Choose **External** user type
5. Fill in required information:
   - **App name**: CareerCopilot (Staging/Production)
   - **User support email**: Your email
   - **Developer contact information**: Your email
6. Add scopes: `openid`, `email`, `profile`
7. Add test users if needed

### **2. Create OAuth Client ID**
1. Go to: **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `CareerCopilot Staging/Production OAuth Client`
5. Add the JavaScript origins and redirect URIs from above
6. Copy the **Client ID** (starts with numbers, ends with `.apps.googleusercontent.com`)

### **3. Add to GitHub Secrets**
```bash
# Staging
gh secret set GOOGLE_OAUTH_CLIENT_ID_STAGING \
  --body "your-staging-client-id.apps.googleusercontent.com" \
  --repo okgoogle13/careercopilot

# Production
gh secret set GOOGLE_OAUTH_CLIENT_ID_PROD \
  --body "your-production-client-id.apps.googleusercontent.com" \
  --repo okgoogle13/careercopilot
```

## 🔍 **Required APIs**

Enable these APIs in both projects:
- OAuth2 API (`oauth2.googleapis.com`)
- Google+ API (`plus.googleapis.com`) 
- People API (`people.googleapis.com`)

## 🧪 **Testing OAuth Setup**

### **Development Testing**
- Use localhost URLs for local development
- Test with your personal Google account
- Verify redirect works correctly

### **Staging Testing**
- Test with staging Firebase Auth
- Verify production-like OAuth flow
- Test with multiple user accounts

### **Production Testing**
- Limited to verified domains only
- Test with real user accounts
- Monitor OAuth quotas and usage

## 🔒 **Security Best Practices**

1. **Separate OAuth clients** for staging and production
2. **Different client secrets** for each environment
3. **Minimal scopes** - only request what you need
4. **Regular rotation** of OAuth credentials
5. **Monitor usage** in Google Cloud Console

## 📊 **OAuth Scopes for CareerCopilot**

**Basic Authentication**:
- `openid` - Required for OpenID Connect
- `email` - Access to user's email address
- `profile` - Access to basic profile info

**Extended Permissions** (if needed):
- `https://www.googleapis.com/auth/userinfo.profile`
- `https://www.googleapis.com/auth/userinfo.email`

## ⚠️ **Common Issues & Solutions**

### **"redirect_uri_mismatch" Error**
- Check that redirect URIs exactly match (case-sensitive)
- Ensure you're using the correct protocol (http vs https)
- Verify the Firebase project domain is correct

### **"invalid_client" Error**
- Verify client ID is correctly added to GitHub secrets
- Check that OAuth client is enabled
- Ensure you're using the correct environment

### **Consent Screen Issues**
- Make sure consent screen is published (not in testing mode)
- Add your domain to authorized domains
- Verify all required fields are filled

## 🚀 **Next Steps**

After OAuth setup:
1. **Test Firebase Auth** with Google Sign-In
2. **Update frontend** to use Google authentication
3. **Configure user roles** and permissions
4. **Set up user profile** creation flow
5. **Test complete authentication** flow

---

**Need help?** Run the automated script or check the [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2).