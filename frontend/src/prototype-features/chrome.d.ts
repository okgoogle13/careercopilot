/* eslint-disable */
// Minimal Chrome extension API type stubs for prototype-features quarantine zone.
// These types exist only to satisfy TypeScript — the chrome global is injected
// by the browser extension runtime and is not available in the web app.
declare const chrome: {
  tabs: {
    query: (queryInfo: object, callback: (tabs: any[]) => void) => void;
    sendMessage: (
      tabId: number,
      message: any,
      callback?: (response: any) => void
    ) => void;
  };
  runtime: {
    lastError?: { message: string };
    sendMessage: (message: any, callback?: (response: any) => void) => void;
  };
};
