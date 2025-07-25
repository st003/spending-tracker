import path from 'path'

import { app, Menu } from 'electron'

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
 * Configures the application main menu
 */
export function initMenu() {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      { role: 'appMenu' },
      {
        label: 'File',
        type: 'submenu',
        submenu: [
          {
            // TODO: add data import functionality
            label: 'Import Data'
          },
          { type: 'separator' },
          { role: 'close' }
        ]
      },
      // TODO: add edit menu?
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
      { role: 'windowMenu' }
      // TODO: add help menu
    ])
  )
}
