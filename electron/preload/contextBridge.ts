import { contextBridge, ipcRenderer } from "electron"
import axios from 'axios'

contextBridge.exposeInMainWorld('ipcApi', {
  invokeOpenWin: () => ipcRenderer.invoke('open-win')
})

contextBridge.exposeInMainWorld('axios', axios)