import { BrowserWindow, dialog } from 'electron'

/**
 * Opens the file selection dialog for choosing a CSV file.
 * See https://www.electronjs.org/docs/latest/api/dialog#dialogshowopendialogwindow-options
 *
 * @param mainWindow The main application window
 */
export async function selectImportFile(mainWindow: BrowserWindow) {

  const fileSelectionResonse = await dialog.showOpenDialog(mainWindow, {
    buttonLabel: 'Select',
    filters: [
      {
        name: 'CSV Files',
        extensions: ['csv']
      }
    ],
    properties: ['dontAddToRecent', 'openFile']
  })

  if (fileSelectionResonse.canceled) return ''

  return fileSelectionResonse.filePaths[0]
}
