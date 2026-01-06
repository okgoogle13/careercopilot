/**
 * Background service worker for CareerCopilot Chrome Extension
 */

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
    if (tab.windowId) {
        chrome.sidePanel.open({ windowId: tab.windowId });
    }
});

// Listen for messages from content scripts or side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'JOB_DATA_EXTRACTED') {
        // Forward job data to side panel
        chrome.runtime.sendMessage({
            type: 'UPDATE_JOB_DATA',
            data: request.data,
        });
    }
    return true;
});

console.log('CareerCopilot Extension: Background service worker loaded (TypeScript)');
