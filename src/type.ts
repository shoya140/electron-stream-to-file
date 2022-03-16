import { IpcRendererEvent } from 'electron'

declare global {
  interface Window {
    ipcRenderer: {
      send: (channel: string, ...args: any[]) => void
      on: (
        channel: string,
        listener: (event: IpcRendererEvent, ...args: any[]) => void
      ) => Function
    }
  }
}
