chrome.storage.local.get(["setting"], (data) => {
  console.log(data);
  const setting = data.setting || [];
  for (const s of setting) {
    if (s.url && window.location.href.match(s.url) && s.title) {
      const newTitle = s.title
        .replace(/\${title}/g, document.title)
        .replace(/\${url}/g, window.location.href)
        .replace(/\${hostname}/g, window.location.hostname)
        .replace(/\${pathname}/g, window.location.pathname)
        .replace(/\${search}/g, window.location.search);
      document.title = newTitle;
    }
  }
});
