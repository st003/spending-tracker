import path from 'path'

import { BrowserWindow, dialog } from 'electron'

/**
 * Opens the file selection dialog for choosing a CSV file.
 * See https://www.electronjs.org/docs/latest/api/dialog#dialogshowopendialogwindow-options
 *
 * @param mainWindow The main application window
 * @return The full path to the file
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

/**
 * Opens the import CSV, parses and validates the data, then inserts
 * the data into the database.
 *
 * @param filePath 
 */
export async function importData(filePath: string) {

  const fileExtention = path.extname(filePath)
  if (fileExtention.toLowerCase() !== '.csv') {
    throw new Error(`Selected file must have the extention '.csv'`)
  }

  // TODOs
  // open & parse csv (https://www.npmjs.com/package/csv-parse)
  // validate data structure
  // import data

  return
}
