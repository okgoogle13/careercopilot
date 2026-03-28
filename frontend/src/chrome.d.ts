// Minimal Chrome extension API type stubs for the local extension sources.
// These declarations keep TypeScript satisfied in the web app workspace;
// the browser injects the real `chrome` global at runtime.

interface ChromeRuntimeMessageSender {
  id?: string;
  origin?: string;
  url?: string;
}

type ChromeMessageListener = (
  request: { action?: string; [key: string]: unknown },
  sender: ChromeRuntimeMessageSender,
  sendResponse: (response?: unknown) => void
) => boolean | void;

declare const chrome: {
  tabs: {
    query: (
      queryInfo: Record<string, unknown>,
      callback: (tabs: Array<Record<string, unknown>>) => void
    ) => void;
    sendMessage: (tabId: number, message: unknown, callback?: (response: unknown) => void) => void;
  };
  runtime: {
    lastError?: { message: string };
    sendMessage: (message: unknown, callback?: (response: unknown) => void) => void;
    onInstalled: {
      addListener: (callback: () => void) => void;
    };
    onMessage: {
      addListener: (callback: ChromeMessageListener) => void;
    };
  };
};
