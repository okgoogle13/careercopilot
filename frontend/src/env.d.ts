// src/env.d.ts
// Minimal ambient declarations for Vite environment variables used in the app.
// This ensures `import.meta.env.VITE_*` is recognized by tsc in CI.

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
  // add other VITE_ variables here as needed, e.g.:
  // readonly VITE_SOME_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
