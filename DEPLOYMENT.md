# Deployment Guide — Vercel + Firebase

> **Stack:** React + Vite (Vercel) + Firebase (Auth + Firestore + Functions with Genkit)  
> **Branch:** `develop` → Vercel preview; `main` → Vercel production  
> **Cost:** $0/month (all free tiers)

---

## Prerequisites

| Tool | Install |
|------|---------|
| Node.js ≥ 18 | https://nodejs.org |
| Firebase CLI | `npm install -g firebase-tools` |
| Vercel CLI (optional) | `npm install -g vercel` |

---

## 1. Firebase Setup

### 1.1 Create or link a Firebase project
```bash
firebase login
firebase use --add   # pick your project or run `firebase projects:create`
```

### 1.2 Get Firebase web config values
1. Open [Firebase Console](https://console.firebase.google.com) → your project
2. Click ⚙️ **Project Settings → General → Your apps**
3. Under **Web apps**, note the 6 config values (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`)

### 1.3 Deploy Firebase Functions
```bash
cd functions
npm install
firebase deploy --only functions
```

### 1.4 Configure CORS for Vercel domain
In your Cloud Function handlers, allow your Vercel domain:
```ts
res.set('Access-Control-Allow-Origin', 'https://<your-project>.vercel.app');
```

---

## 2. Local Development

Create `frontend/.env.local` (never commit this file):

```bash
VITE_FIREBASE_API_KEY=<from Firebase console>
VITE_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<project-id>
VITE_FIREBASE_STORAGE_BUCKET=<project-id>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
VITE_FIREBASE_APP_ID=<app-id>

VITE_API_URL=http://localhost:5001/<project-id>/us-central1
VITE_USE_MOCK_API=false
```

Run the frontend:
```bash
cd frontend
yarn install
yarn dev
```

Run Firebase emulators (optional):
```bash
firebase emulators:start --only auth,functions,firestore
```

---

## 3. Vercel Deployment

### 3.1 Connect repo to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this GitHub repo
3. Vercel picks up `vercel.json` automatically

### 3.2 Set Environment Variables in Vercel
In **Vercel → Project → Settings → Environment Variables**, add:

| Name | Value | Environments |
|------|-------|--------------|
| `VITE_FIREBASE_API_KEY` | `<from Firebase>` | Production, Preview, Development |
| `VITE_FIREBASE_AUTH_DOMAIN` | `<project>.firebaseapp.com` | All |
| `VITE_FIREBASE_PROJECT_ID` | `<project-id>` | All |
| `VITE_FIREBASE_STORAGE_BUCKET` | `<project>.appspot.com` | All |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `<sender-id>` | All |
| `VITE_FIREBASE_APP_ID` | `<app-id>` | All |
| `VITE_API_URL` | `https://us-central1-<project-id>.cloudfunctions.net` | Production, Preview |

### 3.3 Deploy
```bash
# Auto-deploy: push to `develop` (preview) or `main` (production)
git push origin develop

# Or manual deploy via CLI:
vercel --prod
```

---

## 4. Verification

```bash
# 1. Build passes locally
cd frontend && yarn build

# 2. No Supabase references remain
grep -r "supabase" frontend/src    # should return empty

# 3. No Docker files remain
ls Dockerfile docker-compose*.yml  # should say "No such file"

# 4. Firebase Functions live
curl https://us-central1-<project-id>.cloudfunctions.net/healthCheck
```

---

## 5. Environment Variables Reference

| Variable | Layer | Required |
|----------|-------|----------|
| `VITE_FIREBASE_*` (6 vars) | Frontend (Vercel) | ✅ |
| `VITE_API_URL` | Frontend (Vercel) | ✅ Production |
| `VITE_USE_MOCK_API` | Frontend | Dev only |
| `FIREBASE_PROJECT_ID` | Backend Functions | ✅ |
| `GOOGLE_APPLICATION_CREDENTIALS` | Backend Functions | ✅ CI/CD |
| `GEMINI_API_KEY` | Backend Functions | ✅ |

---

## 6. Secrets Management

- **Local:** Use `frontend/.env.local` (gitignored)
- **Vercel:** Project Settings → Environment Variables  
- **Firebase Functions:** `firebase functions:config:set key=value` or Secret Manager  
- **GitHub Actions:** Settings → Secrets → Actions → add `VITE_FIREBASE_*` for any CI steps that build the frontend

---

*Generated: 2026-03-02*
