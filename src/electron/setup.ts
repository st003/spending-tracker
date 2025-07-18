import path from 'path'

import { app, BrowserWindow, Menu } from 'electron'

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
