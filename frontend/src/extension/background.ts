console.log('Background service worker started.');

chrome.runtime.onInstalled.addListener(() => {
  console.log('CareerCopilot Extension installed.');
});
