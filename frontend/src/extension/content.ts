console.log('Content script loaded.');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractJobDescription') {
    // Basic extraction: get all visible text
    // In a real extension, we might want to be smarter (e.g., look for <main>, <article>, or specific job board selectors)
    const pageText = document.body.innerText;
    sendResponse({ text: pageText });
  }
  return true; // Keep the message channel open for asynchronous response
});
