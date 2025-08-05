/*
 * This file is treated differently than all the other files in the electron directory. Unlike the other files
 * which are bundled as part of electron's executable. The preload script is not (due to its .cts extension)
 * and is instead injected as a frontend script when electron runs. As a result this file cannot import from
 * other files in the electron directory.
 *
 * Also, electron does not fully support ESM for preload scripts, so we must use CommonJS here (except for types).
 */

const { contextBridge, ipcRenderer } = require('electron')

import type { IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // menu actions
  openImporter: (callback: (value: true) => void) => {
    return ipcRenderer.on('openImporter', (_: IpcRendererEvent, value: true) => callback(value))
  },
  selectImportFile: () => ipcRenderer.invoke('selectImportFile'),
  sendSelectedFile: (callback: (fileName: string) => void) => {
    return ipcRenderer.on('sendSelectedFile', (_: IpcRendererEvent, fileName: string) => callback(fileName))
  },
  // chart data
  getExpensesForMonth: (isoYYYYMM: string) => ipcRenderer.invoke('getExpensesForMonth', isoYYYYMM),
  getNetIncome: (range: 'month'|'year', start: string, end: string) => ipcRenderer.invoke('getNetIncome', range, start, end)
})
