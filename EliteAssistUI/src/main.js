import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } from 'electron';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let tray;
const dashboards = [];

const createMainWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true
    },
    skipTaskbar: true
  });
  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // hide when close is clicked
  mainWindow.on('close', (e) => {
    // mainWindow.hide();
    mainWindow.setOpacity(0);
    mainWindow.setIgnoreMouseEvents(true);
    e.preventDefault();
  });

  ipcMain.on('add-dashboard', (event, name) => addDashboard);
  ipcMain.on('remove-dashboard', (event, name) => removeDashboard);
};

const buildTrayMenu = () => {
  const menuItems = dashboards.map((name) => ({ label: name, click: () => showDashboard(name) }));
  menuItems.push({ type: 'separator' });
  menuItems.push({ label: 'New Dashboard', click: newDashboard });
  menuItems.push({ label: 'Manage Dashboards', click: manageDashboards });
  menuItems.push({ label: 'Quit', click: () => app.exit(0) });
  const contextMenu = Menu.buildFromTemplate(menuItems);
  tray.setContextMenu(contextMenu);
};

const createTray = () => {
  const icon = nativeImage.createFromPath('assets/elite-assist.png');
  tray = new Tray(icon);

  tray.setTitle('EliteAssist');
  tray.setToolTip('EliteAssist - Elite Dangerous dashboard');

  buildTrayMenu();

  tray.on('double-click', () => mainWindow.show());
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createMainWindow();
  createTray();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

const newDashboard = () => {
  console.log('create new dashboard');
  mainWindow.webContents.send('new-dashboard');
};

const addDashboard = (event, name) => {

};

const removeDashboard = (event, name) => {
};

const manageDashboards = () => {
  console.log('manage dashboards');
  mainWindow.webContents.send('manage-dashboards');
};
