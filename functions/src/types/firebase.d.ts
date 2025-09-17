// Type definitions for Firebase Admin and Functions v2
/// <reference types="firebase-admin" />
/// <reference types="firebase-functions" />

// Extend global environment variables for Functions
declare namespace NodeJS {
  interface ProcessEnv {
    ADMIN_CLEANUP_KEY?: string;
    NODE_ENV?: "production" | "development" | "test";
  }
}
