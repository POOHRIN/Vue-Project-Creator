const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  createProject: (data) => ipcRenderer.invoke("create-vue-project", data),
  onLogUpdate: (callback) => ipcRenderer.on("log-update", (_, msg) => callback(msg)),
});
