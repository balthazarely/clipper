document.addEventListener("copy", () => {
  const selectedText = window.getSelection().toString();

  if (selectedText) {
    chrome.runtime.sendMessage({
      type: "SAVE_CLIP",
      text: selectedText,
    });
  }
});
