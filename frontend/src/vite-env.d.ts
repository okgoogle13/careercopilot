/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_USE_MOCK_API?: string;
  readonly VITE_USE_MOCK_AUTH?: string;
  readonly VITE_OFFLINE_MODE?: string;
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
