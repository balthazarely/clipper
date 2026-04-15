document.addEventListener("copy", () => {
  const selectedText = window.getSelection().toString();

  if (selectedText) {
    try {
      const trimmed = selectedText.trim();
      const start = encodeURIComponent(trimmed.slice(0, 50));
      const end = encodeURIComponent(trimmed.slice(-50));
      const fragment = trimmed.length > 100 ? `${start},${end}` : start;
      const url = `${window.location.origin}${window.location.pathname}#:~:text=${fragment}`;

      const ogImage = document.querySelector('meta[property="og:image"]')?.content;
      const favicon = document.querySelector('link[rel~="icon"]')?.href || `${window.location.origin}/favicon.ico`;
      const thumbnail = ogImage || favicon;

      chrome.runtime.sendMessage({ type: "SAVE_CLIP", text: selectedText, url, thumbnail });
    } catch (e) {
      // extension was reloaded — user needs to refresh the tab
    }
  }
});
