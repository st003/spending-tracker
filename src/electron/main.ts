import path from 'path'

import { app, BrowserWindow, ipcMain } from 'electron'

import { getExpensesForMonth, getNetIncome } from './data.js';
import { getPreloadScriptPath } from './utils.js';

import type { NetIncomeRange } from './types.js'

function createWindow() {
  const mainWindow = new BrowserWindow({
    // TODO: make this fill the screen on open
    width: 1280,
    height: 720,
    webPreferences: {
      preload: getPreloadScriptPath()
    }
  });

  // when in development mode, load the window directly from Vite so we can have hot module reloading
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    // path.join() used for file system compatability
    // app.getAppPath() allows the electro app to find its files no matter where it exists on the file system
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-ui/index.html'))
  }

  ipcMain.handle('getExpensesForMonth', async (_, isoYYYYMM: string) => {
    try {
      return await getExpensesForMonth(isoYYYYMM)
    } catch (error) {
      console.log(error)
      return []
    }
  })

  ipcMain.handle('getNetIncome', (_, range: NetIncomeRange) => {
    return getNetIncome(range)
  })
}

// app main statup logic
app.whenReady().then(() => {
  createWindow()

  // MacOS specific behavior for opening a window if non are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Windows/Linux behavior for closing the application once all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
