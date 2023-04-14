import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('ipcApi', {
  invokeOpenWin: () => ipcRenderer.invoke('open-win')
})
