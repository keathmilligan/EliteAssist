import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  MenuItemConstructorOptions,
  nativeImage,
  ipcMain,
  IpcMainEvent,
  BrowserWindowConstructorOptions,
} from "electron";
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;


let mainWindow: BrowserWindow;
let tray: Tray;

// Dashboard window management
const dashboardWindows = new Map<string, BrowserWindow>();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

// Create and manage main/configuration window
function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
    skipTaskbar: true,
  });
  mainWindow.removeMenu();
  const url = MAIN_WINDOW_WEBPACK_ENTRY + '?window=main';
  console.log(`loading ${url}`);
  mainWindow.loadURL(url);
  // mainWindow.webContents.openDevTools();

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const windowType = url.split("#")[1];
    console.log(`window open: ${windowType}`);
    const opts: BrowserWindowConstructorOptions = {
      titleBarStyle: "hidden",
      transparent: true,
    };
    switch (windowType) {
      case "dialog":
        opts.fullscreenable = false;
        break;
      case "overlay":
        opts.fullscreenable = false;
        opts.alwaysOnTop = true;
        break;
      case "window":
      default:
        opts.transparent = false;
        break;
    }
    return { action: "allow", overrideBrowserWindowOptions: opts };
  });

  // hide when close is clicked
  mainWindow.on("close", (e) => {
    mainWindow.setOpacity(0);
    mainWindow.setIgnoreMouseEvents(true);
    e.preventDefault();
  });
}

// create a dashboard/overlay window
function createDashboardWindow(name: string): BrowserWindow {
  console.log(`creating dashboard window: ${name}`);
  const window = new BrowserWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
    skipTaskbar: true,
    titleBarStyle: 'hidden',
    transparent: false
  });
  window.removeMenu();
  const url = MAIN_WINDOW_WEBPACK_ENTRY + '?dashboard=' + encodeURIComponent(name);
  console.log(`loading ${url}`);
  window.loadURL(url);
  window.webContents.openDevTools();

  // hide when close is clicked
  window.on("close", (e) => {
    window.setOpacity(0);
    window.setIgnoreMouseEvents(true);
    e.preventDefault();
  });

  return window;
}

function showWindow(window: BrowserWindow): void {
  window.setOpacity(1);
  window.setIgnoreMouseEvents(false);
  window.show();
}

// Build and manage Tray menu

function buildTrayMenu(): void {
  const menuItems: Array<MenuItemConstructorOptions> = [];
  for (const [name, window] of dashboardWindows) {
    menuItems.push({label: name, click: () => showWindow(window)});
  }
  menuItems.push({ type: "separator" });
  menuItems.push({ label: "New Dashboard", click: () => newDashboard() });
  menuItems.push({ label: "Settings", click: () => showSettings() });
  menuItems.push({ label: "About", click: () => showAbout() });
  menuItems.push({ type: "separator" });
  menuItems.push({ label: "Quit", click: () => app.exit(0) });
  const contextMenu = Menu.buildFromTemplate(menuItems);
  tray.setContextMenu(contextMenu);
}

function createTray() {
  const icon = nativeImage.createFromPath("assets/elite-assist.png");
  tray = new Tray(icon);

  tray.setTitle("EliteAssist");
  tray.setToolTip("EliteAssist - Elite Dangerous dashboard");

  buildTrayMenu();

  tray.on("double-click", () => showWindow(mainWindow));
}

// Handle app lifecycle events
app.on("ready", () => {
  createMainWindow();
  createTray();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// Manage dashboard views

// Create a new dashboard
function newDashboard() {
  console.log(`tray event: new dashboard`);
  mainWindow.webContents.send("new-dashboard");
  const name = 'Test Dashboard';
  dashboardWindows.set(name, createDashboardWindow(name));
  // refresh the tray menu
  buildTrayMenu();
}

// Show the dashboard management window
function showSettings() {
  console.log("tray event: manage dashboards");
  showWindow(mainWindow);
  mainWindow.webContents.send("show-settings");
}

// Show About window
function showAbout() {
  console.log("tray event: show about window");
  mainWindow.webContents.send("about");
}

// Handle events sent from renderer

// Add a new dashboard to tray menu
ipcMain.on("add-dashboard", (event: IpcMainEvent, args: never[]) => {
  console.log(`renderer event: add-dashboard "${args}"`);
});

// Remove item from tray menu dashboard list
ipcMain.on("remove-dashboard", (event: IpcMainEvent, args: never[]) => {
  console.log(`renderer event: remove-dashboard "${args}"`);
});
