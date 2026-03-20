import { useState, useEffect } from 'react';

export function useChromeExtension() {
  const [isExtension, setIsExtension] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check if running as a Chrome extension
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.tabs) {
      setIsExtension(true);

      // Get current tab URL
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url) {
          setCurrentUrl(tabs[0].url);
        }
      });
    }
  }, []);

  const extractJobFromPage = async (): Promise<string | null> => {
    if (!isExtension) return null;

    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.id) {
          chrome.tabs.sendMessage(activeTab.id, { action: 'extractJobDescription' }, (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              resolve(null);
            } else if (response && response.text) {
              resolve(response.text);
            } else {
              resolve(null);
            }
          });
        } else {
          resolve(null);
        }
      });
    });
  };

  return { isExtension, currentUrl, extractJobFromPage };
}
