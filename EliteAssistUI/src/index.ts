/* eslint-disable @typescript-eslint/no-var-requires */
import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  MenuItemConstructorOptions,
  nativeImage,
  ipcMain,
  BrowserWindowConstructorOptions,
  Point} from "electron";
import { uIOhook } from 'uiohook-napi'
import { WindowState } from "./models/window-state";
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

class ApplicationWindow extends BrowserWindow {
  private fullScreenExt: boolean;
  constructor(options: BrowserWindowConstructorOptions,
              uri: string,
              devTools: boolean) {
    super(options);
    this.removeMenu();
    const url = MAIN_WINDOW_WEBPACK_ENTRY + uri;
    console.log(`loading ${url}`);
    this.loadURL(url);
    if (devTools) {
      this.webContents.openDevTools();
    }
  
    this.webContents.setWindowOpenHandler(({ url }) => {
      const windowType = url.split("#")[1];
      console.log(`window open: ${windowType}`);
      const opts: BrowserWindowConstructorOptions = {
        titleBarStyle: "hidden",
        transparent: true,
        skipTaskbar: true,
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
    this.on("close", (e) => {
      this.hideWindow()
      e.preventDefault();
    });
    
    this.on("enter-full-screen", () => {
      console.log("enter-full-screen");
      this.fullScreenExt = true;
      this.updateWindowState();
    });
  
    this.on("leave-full-screen", () => {
      console.log("leave-full-screen");
      this.fullScreenExt = false;
      this.updateWindowState();
    });
  
    this.on("maximize", () => {
      console.log("maximize");
      this.updateWindowState();
    });
  
    this.on("minimize", () => {
      console.log("minimize");
      this.updateWindowState();
    });
  
    this.on("unmaximize", () => {
      console.log("unmaximize");
      this.updateWindowState();
    });
  
    this.on("restore", () => {
      console.log("restore");
      this.updateWindowState();
    });
  }

  isFullScreenExt(): boolean {
    return this.isFullScreen() || this.fullScreenExt;
  }

  showWindow(): void {
    this.setOpacity(1);
    this.setIgnoreMouseEvents(false);
    this.show();
    this.updateWindowState();
  }
  
  hideWindow(): void {
    this.setOpacity(0);
    this.setIgnoreMouseEvents(true);
    this.updateWindowState();
  }
  
  getWindowState(): WindowState {
    return {
      bounds: this.getBounds(),
      visible: this.getOpacity() > 0,
      minimized: this.isMinimized(),
      maximized: this.isMaximized(),
      fullScreen: this.isFullScreenExt(),
      isNormal: this.isNormal()
    };
  }
  
  updateWindowState() {
    const state = this.getWindowState();
    console.log("update window state: ", state);
    this.webContents.send("window-state", [state]);
  }

  startWindowDrag(dragAnchor: Point) {
    const bounds = this.getBounds();
    let timer: NodeJS.Timeout = null;
    // console.log("start drag", dragAnchor);
    uIOhook.on("mousemove", (e) => {
      if (timer != null) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        const p = screen_.screenToDipPoint({x: e.x, y: e.y});
        // console.log(e, p);
        this.setBounds({
          x: Math.round(p.x - dragAnchor.x),
          y: Math.round(p.y - dragAnchor.y),
          width: bounds.width,
          height: bounds.height
        });
      }, 1);
    });
    uIOhook.on("mouseup", () => {
      // console.log("end drag");
      this.webContents.send("window-stopdrag")
      uIOhook.removeAllListeners();
    });
  }

  toggleMinimize() {
    console.log("minimize: current = ", this.isMinimized());
    this.isMinimized()? this.restore() : this.minimize();
  }
  
  toggleMaximize() {
    console.log("maximize: current = ", this.isMaximized());
    this.isMaximized()? this.unmaximize() : this.maximize();
  }
  
  toggleFullScreen() {
    console.log("full screen: current = ", this.isFullScreen());
    this.setFullScreen(!this.isFullScreenExt());
  }
  
  close() {
    console.log("close window")
    this.hideWindow();
  }
}

let screen_: Electron.Screen;
let mainWindow: ApplicationWindow;
let tray: Tray;

// Dashboard window management
const dashboardWindows = new Map<string, ApplicationWindow>();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

// Create and manage main/configuration window
function createMainWindow(): void {
  mainWindow = new ApplicationWindow({
    width: 800,
    height: 460,
    icon: __dirname + "/assets/elite-assist.ico",
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
    skipTaskbar: true,
    titleBarStyle: "hidden",
    transparent: true,
    fullscreenable: false,
    resizable: false,
  }, '?window=main', true);
}

// create a dashboard/overlay window
function createDashboardWindow(name: string): ApplicationWindow {
  console.log(`creating dashboard window: ${name}`);
  const window = new ApplicationWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
    skipTaskbar: true,
    titleBarStyle: 'hidden',
    transparent: true
  }, '?dashboard=' + encodeURIComponent(name), true);
  return window;
}

// Build and manage Tray menu

function buildTrayMenu(): void {
  const menuItems: Array<MenuItemConstructorOptions> = [];
  for (const [name, dashboard] of dashboardWindows) {
    menuItems.push({label: name, click: () => dashboard.showWindow()});
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

  tray.on("double-click", () => mainWindow.showWindow());
}

// Handle app lifecycle events
app.on("ready", () => {
  const { screen } = require("electron");
  screen_ = screen;
  createMainWindow();
  createTray();
  mainWindow.showWindow();
  uIOhook.start();
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
  mainWindow.showWindow();
  mainWindow.webContents.send("show-settings");
}

// Show About window
function showAbout() {
  console.log("tray event: show about window");
  mainWindow.webContents.send("about");
}

// Handle events sent from renderer

// Show the About window
ipcMain.on("about", () => {
  console.log(`renderer event: about`);
  showAbout();
});

// Quit app
ipcMain.on("quit", () => {
  console.log(`render event: quit app`);
  app.exit();
});

// Add a new dashboard to tray menu
ipcMain.on("add-dashboard", (_, args) => {
  console.log(`renderer event: add-dashboard "${args}"`);
});

// Remove item from tray menu dashboard list
ipcMain.on("remove-dashboard", (_, args) => {
  console.log(`renderer event: remove-dashboard "${args}"`);
});

// Start/stop window drag
ipcMain.on("window-startdrag", (_, args) => {
  const dragAnchor = args[0];
  const appWin = args.length > 1? dashboardWindows.get(args[1]) : mainWindow;
  appWin.startWindowDrag(dragAnchor);
});

// Window control
ipcMain.on("window-getstate", (e, args) => {
  const appWin = args.length > 0? dashboardWindows.get(args[0]) : mainWindow;
  const state = appWin.getWindowState();
  console.log('window-getstate:', state);
  e.returnValue = state;
});

ipcMain.on("window-minimize", (_, args) => {
  const appWin = args.length > 0? dashboardWindows.get(args[0]) : mainWindow;
  appWin.toggleMinimize();
});

ipcMain.on("window-maximize", (_, args) => {
  const appWin = args.length > 0? dashboardWindows.get(args[0]) : mainWindow;
  appWin.toggleMaximize();
});

ipcMain.on("window-fullscreen", (_, args) => {
  const appWin = args.length > 0? dashboardWindows.get(args[0]) : mainWindow;
  appWin.toggleFullScreen();
});

ipcMain.on("window-close", (_, args) => {
  const appWin = args.length > 0? dashboardWindows.get(args[0]) : mainWindow;
  appWin.close();
});
