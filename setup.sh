#!/bin/bash
set -e

# ============================================================
# Careercopilot API-Centric Setup Script (Version 4)
# Scaffolds an API-driven backend and a frontend client
# Frontend calls the backend for data, not Firestore directly.
# ============================================================

# -------- CONSTANTS --------
PARENT_DIR="careercopilot"
BACKEND_DIR="careercopilot-backend"
FRONTEND_DIR="careercopilot-frontend"
GCP_PROJECT_ID="careercopilot-468811"
FIRESTORE_REGION="australia-southeast2"
SERVICE_ACCOUNT_KEY_PATH="functions/service-account.json"
FIREBASE_HOSTING_SITE="careercopilot-468811"
FIREBASE_UID="your-firebase-user-uid-here"

echo "🚀 Starting Careercopilot API-centric setup…"

# -------- CREATE FOLDER STRUCTURE --------
mkdir -p "$PARENT_DIR/$BACKEND_DIR/functions"
mkdir -p "$PARENT_DIR/$FRONTEND_DIR"
cd "$PARENT_DIR/$BACKEND_DIR"

# -------- .env.example (Hardcoded keys as requested) --------
cat > .env.example <<EOF
# Google Cloud / Firebase
FIREBASE_PROJECT_ID=$GCP_PROJECT_ID
GOOGLE_CLOUD_PROJECT=$GCP_PROJECT_ID
GOOGLE_APPLICATION_CREDENTIALS=$SERVICE_ACCOUNT_KEY_PATH
FIRESTORE_REGION=$FIRESTORE_REGION
FIREBASE_HOSTING_SITE=$FIREBASE_HOSTING_SITE
FIREBASE_STORAGE_BUCKET=${GCP_PROJECT_ID}.appspot.com

# Auth
AUTHORIZED_USER_EMAIL=
AUTHORIZED_USER_UID=$FIREBASE_UID

# AI Keys - REPLACE WITH YOUR OWN KEYS
GEMINI_API_KEY="your-gemini-api-key-here"
OPENAI_API_KEY="your-openai-api-key-here"
ANTHROPIC_API_KEY="your-anthropic-api-key-here"
PERPLEXITY_API_KEY="your-perplexity-api-key-here"

# Vector DB
PINECONE_API_KEY="your-pinecone-api-key-here"
PINECONE_ENVIRONMENT=python
PINECONE_INDEX_NAME=careercopilot-index

# Search APIs
SERP_API_KEY="your-serp-api-key-here"

# Environment
ENVIRONMENT=development
LOG_LEVEL=DEBUG
EOF

# -------- FIRESTORE SECURITY RULES --------
cat > firestore.rules <<'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Deny all client-side reads and writes by default.
    // All data access should go through the secure backend API.
    match /{document=**} {
      allow read, write: if false;
    }
    // You can open up specific collections for direct access if needed,
    // but the default should be locked down.
    match /users/{userId} {
      // Example: allow users to read/write their own user document directly
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
EOF

# -------- FIRESTORE INDEXES --------
cat > firestore.indexes.json <<'EOF'
{
  "indexes": [
    {
      "collectionGroup": "profiles",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
EOF

# -------- BACKEND: FASTAPI APP (UPDATED) --------
cat > main.py <<'EOF'
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import auth, credentials, initialize_app, firestore

# NOTE: As the API grows, consider refactoring endpoints into separate files
# under an /api directory and importing them as APIRouters.

app = FastAPI(title="Careercopilot API")
security = HTTPBearer()

# Init Firebase Admin using service account file
if not firebase_admin._apps:
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not cred_path or not os.path.exists(cred_path):
        raise RuntimeError(f"Service account file not found at path: {cred_path}")
    cred = credentials.Certificate(cred_path)
    initialize_app(cred)

db = firestore.client()

# CORS for local dev and hosting preview, with more specific headers
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

def verify_token(token: str):
    try:
        return auth.verify_id_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

def get_uid(bearer=Depends(security)) -> str:
    decoded = verify_token(bearer.credentials)
    return decoded["uid"]

@app.get("/")
def root():
    return {"status": "ok", "message": "Careercopilot backend running"}

@app.get("/profiles")
def list_profiles(uid: str = Depends(get_uid)):
    """Securely fetches profiles for the authenticated user."""
    ref = db.collection("users").document(uid).collection("profiles")
    profiles = [{**doc.to_dict(), "id": doc.id} for doc in ref.stream()]
    return {"profiles": profiles}
EOF

# -------- BACKEND: requirements --------
cat > requirements.txt <<'EOF'
fastapi
uvicorn
firebase-admin
google-cloud-firestore
python-dotenv
EOF

# -------- PYTHON ENV INSTALL --------
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate

echo "⚠️  Place your service account JSON at: $PARENT_DIR/$BACKEND_DIR/$SERVICE_ACCOUNT_KEY_PATH"

# -------- SEED FIRESTORE PROFILES --------
echo "🌱 Seeding Firestore profiles for UID: $FIREBASE_UID"
gcloud firestore documents create "users/${FIREBASE_UID}/profiles/profile1" \
  --project="$GCP_PROJECT_ID" \
  --data-file=- <<EOF
{"name":"AOD Work","keywords":["case management","harm reduction","mental health"],"skills":["assessment","client engagement","safety planning"],"created_at":"$(date -Iseconds)"}
EOF

gcloud firestore documents create "users/${FIREBASE_UID}/profiles/profile2" \
  --project="$GCP_PROJECT_ID" \
  --data-file=- <<EOF
{"name":"LGBTQIA+ Support","keywords":["cultural competency","community outreach","peer support"],"skills":["advocacy","group facilitation","education"],"created_at":"$(date -Iseconds)"}
EOF

# -------- FRONTEND SETUP --------
cd ../$FRONTEND_DIR
npm create vite@latest . -- --template react
npm install
npm install firebase

mkdir -p src

# Firebase config (Hardcoded key as requested)
cat > src/firebaseConfig.js <<EOF
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "\${FIREBASE_API_KEY}",
  authDomain: "${GCP_PROJECT_ID}.firebaseapp.com",
  projectId: "${GCP_PROJECT_ID}",
  storageBucket: "${GCP_PROJECT_ID}.appspot.com",
  // ⚠️ IMPORTANT: You MUST replace the following values before deploying to production!
  // Missing messagingSenderId and appId will BREAK production deployments.
  messagingSenderId: "CHANGE_ME", // <-- Replace with your Firebase Messaging Sender ID
  appId: "CHANGE_ME" // <-- Replace with your Firebase App ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app
EOF

# App.jsx (UPDATED to call the backend API)
cat > src/App.jsx <<'EOF'
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './firebaseConfig'

const API_BASE_URL = 'http://localhost:8000';

export default function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [profiles, setProfiles] = useState([])
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      // Clear profiles on logout
      if (!u) setProfiles([])
    })
    return () => unsub()
  }, [])

  async function login(e) {
    e.preventDefault()
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, pass)
    } catch (err) {
      setError(err.message);
    }
  }

  async function logout() {
    await signOut(auth)
  }

  async function fetchProfilesFromAPI() {
    if (!user) {
      setError("You must be logged in to fetch profiles.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch profiles');
      }

      const data = await response.json();
      setProfiles(data.profiles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Careercopilot (API-Driven)</h1>
      {!user ? (
        <form onSubmit={login}>
          <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="password" type="password" value={pass} onChange={e => setPass(e.target.value)} />
          <button type="submit">Sign In</button>
        </form>
      ) : (
        <>
          <p>Logged in as {user.email}</p>
          <button onClick={logout}>Sign out</button>
          <hr />
          <button onClick={fetchProfilesFromAPI} disabled={loading}>
            {loading ? 'Loading...' : 'Load Profiles from API'}
          </button>
          {profiles.length > 0 && (
            <ul>
              {profiles.map(p => (
                <li key={p.id}>{p.name} — skills: {(p.skills || []).join(', ')}</li>
              ))}
            </ul>
          )}
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
EOF

# -------- LINK PROJECT --------
gcloud config set project "$GCP_PROJECT_ID"
firebase use "$GCP_PROJECT_ID" --add
echo "✅ API-centric setup complete!

Next Steps:
1) Place your service account JSON at: $PARENT_DIR/$BACKEND_DIR/$SERVICE_ACCOUNT_KEY_PATH
2) Create the default Firebase Storage bucket via Firebase Console → Storage → Get Started:
   ${GCP_PROJECT_ID}.appspot.com in region $FIRESTORE_REGION
3) Enable Email/Password auth in Firebase Console → Authentication → Sign-in method.
4) Deploy the updated Firestore rules (which now restrict client access):
   cd $PARENT_DIR/$BACKEND_DIR && firebase deploy --only firestore:rules --project $GCP_PROJECT_ID
5) Run backend locally:
   cd $PARENT_DIR/$BACKEND_DIR && source venv/bin/activate && uvicorn main:app --reload
6) Run frontend locally:
   cd $PARENT_DIR/$FRONTEND_DIR && npm run dev"