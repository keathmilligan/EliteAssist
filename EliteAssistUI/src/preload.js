console.log("preload.js");
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eliteAssist', {
  addDashboard: (name) => ipcRenderer.send('add-dashboard', name),
  removeDashboard: (name) => ipcRenderer.send('remove-dashboard', name),
  handleNewDashboard: (callback) => ipcRenderer.on('new-dashboard', callback),
  handleManageDashboards: (callback) => ipcRenderer.on('manage-dashboards', callback)
});
