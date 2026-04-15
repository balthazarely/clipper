chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SAVE_CLIP") {
    chrome.storage.local.set({ pendingClip: { text: message.text, url: message.url, thumbnail: message.thumbnail, timestamp: Date.now() } });
  }
});
