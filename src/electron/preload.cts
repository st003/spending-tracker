const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
  getExpenses: () => ipcRenderer.invoke('getExpenses')
})
