import { app, BrowserWindow, Menu } from 'electron'

// TODO: add hot-key support

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
