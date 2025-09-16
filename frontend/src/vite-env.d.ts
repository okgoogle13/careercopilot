/// <reference types="vite/client" />

// Add any additional type declarations here

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_API_URL: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_USE_FALLBACK_AUTH: string
  readonly VITE_OFFLINE_MODE: string
  readonly VITE_SHOW_DEBUG_INFO: string
  readonly VITE_ENABLE_DEV_TOOLS: string
  readonly VITE_ENABLE_SERVICE_WORKER: string
  readonly VITE_ENABLE_ANALYTICS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
