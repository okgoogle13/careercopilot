# Backend Setup Guide - CareerCopilot

## Quick Start (Development)

### 1. Set Up Backend Environment

```bash
# Navigate to backend directory
cd /home/njd/careercopilot/careercopilot-1/backend

# Create a virtual environment (if not exists)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your settings
nano .env
```

**Minimum required settings for local development:**

```env
# Environment
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=DEBUG

# Database (SQLite for local dev - no setup needed)
DATABASE_URL=sqlite:///data/careercopilot-dev.db

# Firebase/Google Cloud (Optional for basic testing)
# You can skip these initially and use mock auth
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/firebase-key.json
GCP_PROJECT_ID=careercopilot-468811

# Feature Flags
ENABLE_MULTI_AGENT=false
ENABLE_ML_ANALYSIS=false
ENABLE_WEB_SEARCH=false
ENABLE_EMAIL_NOTIFICATIONS=false
```

### 3. Start the Backend Server

```bash
# Make sure you're in the backend directory with venv activated
cd /home/njd/careercopilot/careercopilot-1/backend
source venv/bin/activate

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: **http://localhost:8000**

API docs will be at: **http://localhost:8000/docs**

### 4. Test the Backend

Open your browser and go to:
- http://localhost:8000/docs - Interactive API documentation
- http://localhost:8000/health - Health check endpoint

## Authentication Setup

### Option 1: Mock Authentication (Easiest for Testing)

For local development without Firebase, you can create a mock user endpoint:

1. The backend should have a `/auth/register` endpoint
2. Use the frontend to register a test user
3. Credentials are stored in the local SQLite database

### Option 2: Firebase Authentication (Production-like)

1. **Get Firebase Credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `careercopilot-468811`
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely

2. **Configure Backend:**
   ```bash
   # Update .env
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/firebase-key.json
   GCP_PROJECT_ID=careercopilot-468811
   FIREBASE_PROJECT_ID=careercopilot-468811
   ```

3. **Configure Frontend:**
   ```bash
   # In frontend/.env
   VITE_API_URL=http://localhost:8000
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=careercopilot-468811.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=careercopilot-468811
   ```

## Testing the Full Stack

### Terminal 1 - Backend
```bash
cd /home/njd/careercopilot/careercopilot-1/backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend
```bash
cd /home/njd/careercopilot/careercopilot-1/frontend
npm run dev
```

### Terminal 3 - Test Login
```bash
# Register a test user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

## Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is already in use
lsof -i :8000

# Kill the process if needed
kill -9 <PID>

# Check Python dependencies
pip list | grep fastapi
pip list | grep uvicorn
```

### Database issues
```bash
# The SQLite database will be created automatically
# Location: backend/data/careercopilot-dev.db

# If you need to reset it:
rm -f backend/data/careercopilot-dev.db

# Restart the backend to recreate
```

### Authentication errors
```bash
# Check backend logs for detailed error messages
# Common issues:
# 1. CORS - make sure backend allows frontend origin
# 2. Token mismatch - clear browser localStorage
# 3. Firebase credentials - verify .env file path
```

## Next Steps

1. **Start both servers** (backend on :8000, frontend on :5173)
2. **Open browser** to http://localhost:5173
3. **Register a test account** using the signup form
4. **Login** with your test credentials
5. **Explore the app!**

## Production Deployment

For production deployment to Google Cloud Run or Firebase Functions, see:
- `backend/Dockerfile` - Container configuration
- `backend/cloudbuild.yaml` - CI/CD configuration
- `.github/workflows/` - GitHub Actions workflows
