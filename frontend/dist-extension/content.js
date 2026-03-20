console.log("Content script loaded.");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractJobDescription") {
    const pageText = document.body.innerText;
    sendResponse({ text: pageText });
  }
  return true;
});
//# sourceMappingURL=content.js.map
