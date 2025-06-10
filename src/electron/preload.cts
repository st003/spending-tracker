const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getExpenses: () => ipcRenderer.invoke('getExpenses'),
  getNetIncome: (range: string) => ipcRenderer.invoke('getNetIncome', range)
})
