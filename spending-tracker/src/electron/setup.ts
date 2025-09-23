import path from 'path'

import { app, BrowserWindow, Menu } from 'electron'
import log from 'electron-log/main.js'

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
 * Configures application logging
 */
export function initLogger() {
  log.initialize()
  if (process.env.NODE_ENV === 'development') {
    log.transports.file.level = false
  } else {
    log.transports.console.level = false
  }
}

/**
 * Configures the application main menu
 */
export function initMenu(mainWindow: BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      { role: 'appMenu' },
      {
        label: 'File',
        type: 'submenu',
        submenu: [
          {
            label: 'Import Data',
            accelerator:  'CmdOrCtrl+I',
            click: () => mainWindow.webContents.send('openImporter', true)
          },
          { type: 'separator' },
          { role: 'close' }
        ]
      },
      { role: 'editMenu' },
      {
        label: 'View',
        type: 'submenu',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          {
            role: 'toggleDevTools',
            visible: process.env.NODE_ENV === 'development'
          },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      { role: 'windowMenu' },
      {
        label: 'Help',
        type: 'submenu',
        submenu: [
          {
            label: 'Documentation',
            click: () => mainWindow.webContents.send('openDocumentation')
          }
        ]
      }
    ])
  )
}
