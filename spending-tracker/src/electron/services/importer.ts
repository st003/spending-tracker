import fs from 'fs'
import path from 'path'

import { BrowserWindow, dialog } from 'electron'
import { parse } from 'csv-parse'
import sqlite3 from 'sqlite3'

import { DB } from '../db/index.js'

import type { CastingContext } from 'csv-parse'

/**
 * Opens the file selection dialog for choosing a CSV file.
 * See https://www.electronjs.org/docs/latest/api/dialog#dialogshowopendialogwindow-options
 *
 * @param mainWindow The main application window
 * @return The full path to the file
 */
async function selectImportFile(mainWindow: BrowserWindow) {

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
 * Checks if the given header name is valid and is in the correct
 * column. Required header names and order are:
 *
 * |paymentDate|amount|description|category|
 *
 * @param header A column header name
 * @param ctx An instance of csv-parse CastingContext
 */
export function validateHeader(header: string, ctx: CastingContext): string {

  if (!['paymentDate', 'amount', 'description', 'categoryName'].includes(header)) {
    throw new Error(`Invalid header '${header}' at column ${ctx.index}`);
  }

  if ((header === 'paymentDate' && ctx.index !== 0)
      || (header === 'amount' && ctx.index !== 1)
      || (header === 'description' && ctx.index !== 2)
      || (header === 'categoryName' && ctx.index !== 3))
  {
    throw new Error(`Column '${header}' cannot be in position ${ctx.index}`);
  }

  return header;
}

/**
 * Verifies value is an ISO 3601 date string formatted as YYYY-MM-DD
 * and then converts it to a Date object.
 *
 * @param value An ISO 3601 date string formatted as YYYY-MM-DD
 * @param ctx An instance of csv-parse CastingContext
 */
export function validateDateString(value: string, ctx: CastingContext): string {

  // TODO: improve this function
  // (1) It doesn't validate the parts are numbers
  // (2) It doesn't validate illegal numbers like 60
  // Use Date() to parse and validate
  // Add mm/dd/yyyy support

  const parts = value.split('-')

  if ((parts.length !== 3)
      || (parts[0].length !== 4)
      || (parts[1].length !== 2)
      || (parts[2].length !== 2)
  ) {
    throw new Error(`Cannot parse '${value}' into date at column: ${ctx.index} row: ${ctx.lines}`)
  }

  return value
}

// TODO: add tests for this function
/**
 * Verifies the given value can be converted into a number,
 * then converts dollars into cents,
 *
 * @param value 
 * @param ctx An instance of csv-parse CastingContext
 */
function castToCents(value: string, ctx: CastingContext): Number {
  const num = Number(value)

  if (Number.isNaN(num)) {
    throw new Error(`Cannot parse '${value}' into number at column: ${ctx.index} row: ${ctx.lines}`)
  }

  return Math.trunc(num * 100)
}

export type PaymentImport = {
  paymentDate: string;
  amount: number;
  description: string;
  categoryName: string;
}

/**
 * Parses an import CSV file into an array of objects.
 *
 * Uses 'csv-parse' library. See https://csv.js.org/parse/
 *
 * @param filePath The full path to the CSV file to import data from
 * @returns A Promise with an array of the csv rows
 */
function parseCSV(filePath: string): Promise<PaymentImport[]> {
  return new Promise((resolve, reject) => {
    const rows: PaymentImport[] = []
    fs.createReadStream(filePath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: (value: string, context: CastingContext) => {
          if (context.header) {
            return validateHeader(value, context)
          } else if (context.index === 0) {
            return validateDateString(value, context)
          } else if (context.index === 1) {
            return castToCents(value, context)
          } else {
            return value
          }
        }
      }))
      .on('data', (row: PaymentImport) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', error => reject(error))
    })
}

type CategoryMap = {
  [categoryName: string]: number;
}

type CategoryRow = {
  id: number;
  name: string;
}

/**
 * Queries all categories from the database and returns a mapping of a cateogory's
 * name to its id
 *
 * @returns An object where the key-value pairs are a category's name to its id
 */
async function getCategoryMap(): Promise<CategoryMap> {
  return new Promise((resolve, reject) => {

    const db = new sqlite3.Database(DB, error => {
      if (error) reject(error)
    })

    const sql = `SELECT id, name FROM Categories`

    db.all(sql, (error, rows: CategoryRow[]) => {

      if (error) {
        db.close()
        reject(error)

      } else {
        const categoryMap: CategoryMap = {}
        for (const row of rows) {
          categoryMap[row.name] = row.id
        }

        db.close()
        resolve(categoryMap)
      }
    })
  })
}

/**
 * Creates new categories in the database from the given names and
 * and returns a mapping of category names to their database id.
 *
 * @param categories The names of the categories to be created
 * @returns An object where the key-value pairs are a category's name to its id
 */
async function createNewCategories(categories: string[]): Promise<CategoryMap> {

  const categoryMap: CategoryMap = {}

  const db = new sqlite3.Database(DB, error => {
    if (error) throw error
  })

  const insert = (category: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO Categories (name) VALUES (?);'
      db.run(sql, [category], function(error) {
        if (error) reject(error)
        else resolve(this.lastID)
      })
    })
  }

  for (const category of categories) {
    try {
      const id = await insert(category)
      categoryMap[category] = id
    } catch (error) {
      db.close()
      throw error
    }
  }

  db.close()
  return categoryMap
}

type Payment = {
  paymentDate: string;
  amount: number;
  description: string;
  categoryId: number;
}

/**
 * Inserts new payment data into the database
 *
 * @param payments An array of payment data
 */
async function createNewPayments(payments: Payment[]): Promise<void> {

  const db = new sqlite3.Database(DB, error => {
    if (error) throw error
  })

  const insert = (p: Payment): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO Payments (payment_date, amount, description, category_id) VALUES (?, ?, ?, ?);'
      const params = [p.paymentDate, p.amount, p.description, p.categoryId]
      db.run(sql, params, (error) => {
        if (error) reject(error)
        else resolve(undefined)
      })
    })
  }

  for (const payment of payments) {
    try {
      await insert(payment)
    } catch (error) {
      db.close()
      throw error
    }
  }

  db.close()
}

/**
 * Writes the data from an import CSV into the database. Locates
 * existing categories by name and creates new categories when
 * a new categeoryName is provided.
 *
 * @param rows The parsed and validated import data
 */
async function writeToDatabase(importRows: PaymentImport[]): Promise<void> {

  const importCategoryNames = importRows.map(row => row.categoryName)
  const uniqueImportCategoryNames = new Set(importCategoryNames)

  let existingCategories = await getCategoryMap()

  // determine which categories need to be created
  const newCategories: string[] = []
  for (const category of uniqueImportCategoryNames) {
    if (!(category in existingCategories)) {
      newCategories.push(category)
    }
  }

  const newCategoryMap = await createNewCategories(newCategories)

  // update local map with new category ids
  existingCategories = Object.assign(existingCategories, newCategoryMap)

  // prep payment data for insert
  const payments = importRows.map(row => {
    const payment: Payment = {
      paymentDate: row.paymentDate,
      amount: row.amount,
      description: row.description,
      categoryId: existingCategories[row.categoryName]
    }
    return payment
  })

  await createNewPayments(payments)

  return
}

/**
 * Opens the import CSV, parses and validates the data, then inserts
 * the data into the database.
 *
 * @param filePath The full path to the CSV file to import data from
 */
async function importData(filePath: string) {

  const fileExtention = path.extname(filePath)
  if (fileExtention.toLowerCase() !== '.csv') {
    throw new Error(`Selected file must have the extention '.csv'`)
  }

  try {
    const rows = await parseCSV(filePath)
    await writeToDatabase(rows)
  } catch (error) {
    throw error
  }
}

export { importData, selectImportFile }
