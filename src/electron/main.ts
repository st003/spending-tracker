import path from 'path'

import { app, BrowserWindow, ipcMain, screen } from 'electron'

import { getExpensesForMonth, getNetIncome } from './data.js'
import { initDatabase } from './db/index.js'
import { getPreloadScriptPath } from './setup.js'

import type { NetIncomeRange } from './types.js'

function createWindow() {

  // database

  initDatabase()

  // window

  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
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

  // TODO: complete main menu
  // initMenu(mainWindow)

  // events

  ipcMain.handle('getExpensesForMonth', async (_, isoYYYYMM: string) => {
    try {
      return await getExpensesForMonth(isoYYYYMM)
    } catch (error) {
      console.error(error)
      return []
    }
  })

  ipcMain.handle('getNetIncome', async (_, range: NetIncomeRange, start: string, end: string) => {
    try {
      return await getNetIncome(range, start, end)
    } catch (error) {
      console.error(error)
      return []
    }
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
