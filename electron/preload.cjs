const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Folder picker
  browseFolder: () => ipcRenderer.invoke("browse-folder"),

  // Project creation
  createProject: (data) => ipcRenderer.send("create-project", data),
});
