import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('versions', {
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
});

contextBridge.exposeInMainWorld('dashboard', {
  add: (name: string): void => ipcRenderer.send('addDashboard', name),
  remove: (name: string): void => ipcRenderer.send('removeDashboard', name),
  handleNew: (callback: never) => ipcRenderer.on('new-dashboard', callback)
});
