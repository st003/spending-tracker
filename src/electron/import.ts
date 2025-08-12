import fs from 'fs'
import path from 'path'

import { BrowserWindow, dialog } from 'electron'
import { CastingContext, parse } from 'csv-parse'

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

// TODO: add tests for this function
/**
 * Verifies value is an ISO 3601 date string formatted as YYYY-MM-DD
 * and then converts it to a Date object.
 *
 * @param value An ISO 3601 date string formatted as YYYY-MM-DD
 * @param ctx An instance of csv-parse CastingContext
 */
function castToDate(value: string, ctx: CastingContext): Date {
  const parts = value.split('-')

  if ((parts.length !== 3) &&
      (parts[0].length !== 4) &&
      (parts[1].length !== 2) &&
      (parts[2].length !== 2)
  ) {
    throw new Error(`Cannot parse "${value}" into date at column: ${ctx.index} row: ${ctx.lines}`)
  }

  return new Date(value)
}

/**
 * Parses an import CSV file into an array of objects.
 *
 * Uses 'csv-parse' library. See https://csv.js.org/parse/
 *
 * @param filePath The full path to the CSV file to import data from
 * @returns A Promise with an array of objects
 */
function parseCSV(filePath: string): Promise<object[]> {
  return new Promise((resolve, reject) => {
    const rows: object[] = []
    fs.createReadStream(filePath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: (value: string, context: CastingContext) => {
          if (context.header) {
            return value
          } else if (context.index === 0) {
            return castToDate(value, context)
          } else {
            return value
          }
        }
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

    // TODO: import data into database

  } catch (error) {
    throw error
  }
}
