import { IpcRendererEvent } from "electron";

// export default interface ipc {
//   // send messages to main proc
//   addDashboard: (name: string) => void,
//   removeDashboard: (name: string) => void,

//   // handle events sent to renderer proc
//   handleAbout: (callback: (event: IpcRendererEvent, ...args: never[]) => void) => void,
//   handleNewDashboard: (callback: (event: IpcRendererEvent, ...args: never[]) => void) => void,
//   handleShowDashboard: (callback: (event: IpcRendererEvent, ...args: never[]) => void) => void,
//   handleManageDashboards: (callback: (event: IpcRendererEvent, ...args: never[]) => void) => void
// }

export class IPCAPI {
  send: (channel: string, message: string) => void;
  onReceive: (channel: string, callback: (event: IpcRendererEvent, ...args: never[]) => void) => void;
}
