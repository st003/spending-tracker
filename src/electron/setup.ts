import path from 'path'

import { app } from 'electron'

export var DB: string

/**
 * Because preload scripts are injected into the frontend they will reside
 * in different locations during dev and in a package. This function dynamically
 * returns the correct path based on the current environment
 *
 * @returns The path to the preload script
 */
export function getPreloadScriptPath(): string {
  return path.join(
    app.getAppPath(),
    (process.env.NODE_ENV === 'development') ? '.' : '..',
    '/dist-electron/preload.cjs'
  )
}

/**
 * Initiates the database path
 */
export function initDatabase() {
  if (process.env.NODE_ENV === 'development') {
    DB = 'data.db'
  } else {
    const userDataDir = app.getPath('userData')
    DB = `${userDataDir}/data.db`
  }
}

// TODO: add hot-key support
/*
export function initMenu(mainWindow: BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: 'Spending Tracker',
        type: 'submenu',
        submenu: [
          {
            label: 'Open Developer Tools',
            click: () => mainWindow.webContents.openDevTools(),
            visible: process.env.NODE_ENV === 'development'
          },
          {
            label: 'Quit Spending Tracker',
            click: app.quit
          }
        ]
      },
      {
        label: 'File',
        type: 'submenu',
        submenu: [
          {
            label: 'Import Data'
            // TODO: add data import functionality
          }
        ]
      }
    ])
  )
}
*/
