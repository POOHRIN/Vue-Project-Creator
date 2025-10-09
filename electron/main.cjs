const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
    },
  });

  const url = process.env.VITE_DEV_SERVER_URL;
  if (url) win.loadURL(url);
  else win.loadFile(path.join(__dirname, "../dist/index.html"));
}

app.whenReady().then(createWindow);

// 🟡 Folder picker handler
ipcMain.handle("browse-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

// 🟢 Vue project creation handler (as before)
ipcMain.on("create-project", (event, data) => {
  const { root, name, features } = data;
  const proc = spawn("npm", ["create", "vue@latest", name], {
    cwd: root,
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });

  proc.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    console.log(text);

    if (text.includes("TypeScript")) proc.stdin.write(features.includes("typescript") ? "y\n" : "n\n");
    else if (text.includes("Vue Router")) proc.stdin.write(features.includes("router") ? "y\n" : "n\n");
    else if (text.includes("Pinia")) proc.stdin.write(features.includes("pinia") ? "y\n" : "n\n");
    else if (text.includes("Vitest")) proc.stdin.write(features.includes("vitest") ? "y\n" : "n\n");
    else if (text.includes("ESLint")) proc.stdin.write(features.includes("eslint") ? "y\n" : "n\n");
  });

  proc.stderr.on("data", (err) => console.error(err.toString()));
  proc.on("exit", () => {
    console.log("✅ Project created successfully");
    const install = spawn("npm", ["install"], {
      cwd: path.join(root, name),
      shell: true,
    });
    install.stdout.on("data", d => console.log(d.toString()));
  });
});