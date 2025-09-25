import path from 'path'

import { app, BrowserWindow, ipcMain, screen } from 'electron'
import log from 'electron-log/main.js'

import { getPreloadScriptPath, initLogger, initMenu } from './setup.js'
import { initDatabase } from './db/index.js'
import { getExpensesForMonth } from './services/expenses.js'
import { importData, selectImportFile } from './services/importer.js'
import { getNetIncome } from './services/netIncome.js'

import type { NetIncomeRange } from './types.js'

// in-memory storage for import file path
var importFile = ''

async function createWindow() {

  // logging
  initLogger()

  // database
  await initDatabase()

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

  initMenu(mainWindow)

  // register events

  ipcMain.handle('getExpensesForMonth', async (_, isoYYYYMM: string) => {
    try {
      // return await getExpensesForMonth(isoYYYYMM)
      throw new Error('Logging test')
    } catch (error) {
      log.error(error)
      return []
    }
  })

  ipcMain.handle('getNetIncome', async (_, range: NetIncomeRange, start: string, end: string) => {
    try {
      return await getNetIncome(range, start, end)
    } catch (error) {
      log.error(error)
      return []
    }
  })

  ipcMain.handle('selectImportFile', async () => {
    const filePath = await selectImportFile(mainWindow)
    if (filePath) importFile = filePath
    return path.basename(filePath)
  })

  ipcMain.handle('import', async () => {
    try {
      await importData(importFile)
      importFile = ''
      return { error: false, message: '' }

    } catch (error) {

      if (error instanceof Error) {
        log.error(error)
        return { error: true, message: error.message }
      } else {
        log.error(error)
        return { error: true, message: 'An unknown error occured. See logs for details' }
      }
    }
  })
}

// app main statup logic
app.whenReady().then(async () => {
  await createWindow()

  // MacOS specific behavior for opening a window if non are open
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow()
    }
  })
})

// Windows/Linux behavior for closing the application once all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
