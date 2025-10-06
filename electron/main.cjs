const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load Vite dev server during development or built files in production
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// 🧠 IPC to handle "create project" command from Vue UI
ipcMain.handle("create-vue-project", async (event, { root, name, features }) => {
  return new Promise((resolve) => {
    const cmd = `cd "${root}" && npm create vue@latest ${name} -- ${features}`;
    const process = exec(cmd, { shell: true });

    let logs = "";

    process.stdout.on("data", (data) => {
      logs += data;
      win.webContents.send("log-update", data); // Stream logs to UI
    });

    process.stderr.on("data", (data) => {
      logs += data;
      win.webContents.send("log-update", data);
    });

    process.on("close", (code) => {
      if (code === 0) {
        exec(`cd "${root}/${name}" && npm install`, () => {
          win.webContents.send("log-update", "\n✅ Project ready!");
          resolve("done");
        });
      } else {
        resolve("error");
      }
    });
  });
});
