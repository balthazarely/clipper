chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SAVE_CLIP") {
    chrome.storage.local.get(["clips"], (result) => {
      const clips = result.clips || [];
      clips.unshift({ text: message.text, timestamp: Date.now() });
      chrome.storage.local.set({ clips });
    });
  }
});
