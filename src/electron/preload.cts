/*
 * This file is treated differently than all the other files in the electron directory. Unlike the other files
 * which are bundled as part of electron's executable. The preload script is not (due to its .cts extension)
 * and is instead injected as a frontend script when electron runs. As a result this file cannot import from
 * other files in the electrondirectory.
 *
 * Also, electron does not fully support ESM for preload scripts, so we must use CommonJS here.
 */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getExpensesForMonth: (isoYYYYMM: string) => ipcRenderer.invoke('getExpensesForMonth', isoYYYYMM),
  getNetIncome: (range: string) => ipcRenderer.invoke('getNetIncome', range)
})
