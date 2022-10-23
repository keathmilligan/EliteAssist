import type { IPCAPI } from './ipc';

declare global {
  interface Window {
    ipc: IPCAPI
  }
}
