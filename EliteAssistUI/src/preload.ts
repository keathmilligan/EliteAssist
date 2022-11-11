// main-renderer IPC
import { contextBridge, ipcRenderer } from 'electron';
import { IPCAPI } from './ipc';

const ipc: IPCAPI = {
  send: (channel, args) => ipcRenderer.send(channel, args),
  sendSync: (channel, args) => ipcRenderer.sendSync(channel, args),
  onReceive: (channel, callback) => ipcRenderer.on(channel, callback),
};

contextBridge.exposeInMainWorld('ipc', ipc);
