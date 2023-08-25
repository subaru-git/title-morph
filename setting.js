chrome.storage.local.get(["setting"], (data) => {
  console.log(data);
  const setting = data.setting || [];
  for (let i = 0; i < setting.length; i++) {
    addSetting(setting, setting[i].id);
    document.getElementById(`url-${setting[i].id}`).value = setting[i].url;
    document.getElementById(`title-${setting[i].id}`).value = setting[i].title;
  }
});

document
  .getElementsByClassName("add-setting")[0]
  .addEventListener("click", () => {
    chrome.storage.local.get("setting", (data) => {
      const setting = data.setting || [];
      const id = generateUUID();
      chrome.storage.local.set(
        {
          setting: [...setting, { id, url: "", title: "" }],
        },
        () => addSetting(setting, id)
      );
    });
  });

chrome.storage.onChanged.addListener((changes) => console.log(changes));

const addSetting = (setting, id) => {
  const container = document.getElementsByClassName("setting-container")[0];
  const group = document.createElement("div");
  group.className = "setting-group";
  group.id = `setting-group-${id}`;
  group.innerHTML = `
  <div class="setting-content" id="content-${id}">
  <label class="url-label" for="url-${id}">URL Regex</label>
  <input
    class="url-input"
    type="text"
    id="url-${id}"
    placeholder="https://example.com/.*"
  />
  <br />
  <label class="title-label" for="title-${id}">Title</label>
  <input
    class="title-input"
    type="text"
    id="title-${id}"
    placeholder="New Title"
  />
  <button class="setting-delete" id="delete-${id}">Delete</button>
</div>`;
  container.appendChild(group);
  document.getElementById(`url-${id}`).addEventListener("change", () => {
    chrome.storage.local.get(["setting"], (data) => {
      const setting = data.setting || [];
      const url = document.getElementById(`url-${id}`).value;
      const updatedSetting = setting.map((s) =>
        s.id === id ? { ...s, url } : s
      );
      chrome.storage.local.set({ setting: updatedSetting });
    });
  });
  document.getElementById(`title-${id}`).addEventListener("change", () => {
    chrome.storage.local.get(["setting"], (data) => {
      const setting = data.setting || [];
      const title = document.getElementById(`title-${id}`).value;
      const updatedSetting = setting.map((s) =>
        s.id === id ? { ...s, title } : s
      );
      chrome.storage.local.set({ setting: updatedSetting });
    });
  });
  document.getElementById(`delete-${id}`).addEventListener("click", () => {
    chrome.storage.local.get(["setting"], (data) => {
      const setting = data.setting || [];
      const updatedSetting = setting.filter((s) => s.id !== id);
      chrome.storage.local.set({ setting: updatedSetting });
      document.getElementById(`setting-group-${id}`).remove();
    });
  });
};

const generateUUID = () => {
  let d = new Date().getTime();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};
