import fs from 'fs'
import path from 'path'

import { parse } from 'csv-parse'

import { BrowserWindow, dialog } from 'electron'
import { LargeNumberLike } from 'crypto'

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
 * Parses a CSV file into an array of object. The only constraint placed upon the
 * CSV file is the first row contains column headings. Otherwise this function sets
 * no restrictions as to the number of columns or their contents.
 *
 * @param filePath The full path to the CSV file to import data from
 * @returns A Promise with an array of objects
 */
function parseCSV(filePath: string): Promise<object[]> {
  return new Promise((resolve, reject) => {
    const rows: object[] = []
    fs.createReadStream(filePath)
      .pipe(parse({
        columns: true, // import csv requires column headers
        skip_empty_lines: true,
        trim: true,
      }))
      .on('data', (row: object) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', error => reject(error))
    })
}

/**
 * Opens the import CSV, parses and validates the data, then inserts
 * the data into the database.
 *
 * @param filePath The full path to the CSV file to import data from
 */
export async function importData(filePath: string) {

  const fileExtention = path.extname(filePath)
  if (fileExtention.toLowerCase() !== '.csv') {
    throw new Error(`Selected file must have the extention '.csv'`)
  }

  try {
    const rows = await parseCSV(filePath)
    console.log(rows)

    // TODOs
    // validate data structure
    // import data into database

  } catch (error) {
    throw error
  }
}
