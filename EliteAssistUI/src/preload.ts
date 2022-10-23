// main-renderer IPC
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IPCAPI } from './ipc';

const ipc: IPCAPI = {
  send: (channel: string, message: string) => ipcRenderer.send(channel, message),
  onReceive: (channel: string, callback: (event: IpcRendererEvent, ...args: never[]) => void) => ipcRenderer.on(channel, callback),
};

contextBridge.exposeInMainWorld('ipc', ipc);
