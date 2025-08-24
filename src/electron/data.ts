import sqlite3 from 'sqlite3'

import { DB } from './db/index.js'

import type { Expense, NetIncome, NetIncomeBucket, NetIncomeRange, PaymentImport } from './types.js'

/**
 * Takes an ISO 8601 string formatted as YYYY-MM and returns an array with two
 * ISO date strings. The first being the first day of the month, and second being the first
 * day of the following month. Example:
 *
 * '2025-05' => ['2025-05-01', '2025-06-01']
 *
 * @param isoYYYYMM An ISO 8601 formatted date string containing only year and month. YYYY-MM
 * @returns An array with two ISO Date strings
 */
function getMonthRange(isoYYYYMM: string): string[] {

  const currentMonth = new Date(isoYYYYMM)
  const thisMonth = currentMonth.toISOString().slice(0, 10)

  let nextMonth: string
  if (currentMonth.getUTCMonth() == 11) {
    currentMonth.setUTCFullYear(currentMonth.getUTCFullYear() + 1)
    currentMonth.setUTCMonth(0)
    nextMonth = currentMonth.toISOString().slice(0, 10)
  } else {
    currentMonth.setUTCMonth(currentMonth.getUTCMonth() + 1)
    nextMonth = currentMonth.toISOString().slice(0, 10)
  }

  return [thisMonth, nextMonth]
}

/**
 * Groups expenses in from the same month & year into a NetIncome object and returns
 * each month's total income and expenses.
 *
 * @param expenses An array of Expenses
 * @returns An array of NetIncomes
 */
export function getNetIncomeMonths(expenses: Expense[]): NetIncome[] {

  const months: NetIncomeBucket = {}

  for (const exp of expenses) {

    // use "YYYY-MM" as the object key
    const key = exp.date.toISOString().slice(0, 7)

    if (key in months) {

      if (exp.amount > 0) months[key].income += exp.amount
      else months[key].expense += exp.amount

    } else {

      const month: NetIncome = {
        income: 0,
        expense: 0,
        range: getNetIncomeRangeLabelMonth(exp.date)
      }

      if (exp.amount > 0) month.income += exp.amount
      else month.expense += exp.amount

      months[key] = month
    }
  }

  // convert string ISO date key YYYY-MM to an integer
  // do an integer sort
  const sortKeys = Object.keys(months).sort((a, b) => {
    const aAsNum = new Date(a).getTime()
    const bAsNum = new Date(b).getTime()
    return aAsNum - bAsNum
  })

  const netIncomes: NetIncome[] = []
  for (const key of sortKeys) {
    netIncomes.push(months[key])
  }

  return netIncomes
}

/**
 * Takes a Date and returns a formatted string with the short month
 * and a 2-digit yeat. Example:
 *
 * 2025-05-01 => "May '25"
 *
 * @param date A Date object
 * @returns A formatted string
 */
function getNetIncomeRangeLabelMonth(date: Date): string {
  const shortMonth = date.toLocaleString('default', { month: 'short', timeZone: 'UTC' })
  const twoDigityear = date.getUTCFullYear().toString().slice(2, 4)
  return `${shortMonth} '${twoDigityear}`
}

/**
 * Groups expenses in from the same year into a NetIncome object and returns
 * each month's total income and expenses.
 *
 * @param expenses An array of Expenses
 * @returns An array of NetIncomes
 */
export function getNetIncomesYear(expenses: Expense[]): NetIncome[] {

  const years: NetIncomeBucket = {}

  for (const exp of expenses) {

    // use year as the object key
    const key = exp.date.getUTCFullYear().toString()

    if (key in years) {

      if (exp.amount > 0) years[key].income += exp.amount
      else years[key].expense += exp.amount

    } else {

      const year: NetIncome = {
        income: 0,
        expense: 0,
        range: key.toString()
      }

      if (exp.amount > 0) year.income += exp.amount
      else year.expense += exp.amount

      years[key] = year
    }
  }

  // Object.keys() alway casts the key to type string...
  const sortKeys = Object.keys(years).sort((a, b) => {
    return Number(a) - Number(b)
  })

  const netIncomes: NetIncome[] = []
  for (const key of sortKeys) {
    netIncomes.push(years[key])
  }

  return netIncomes
}

type ExpenseDBRow = {
  id: number;
  description: string;
  amount: number;
  payment_date: string;
  category_name: string;
}

/**
 * Returns the all payments from a given month who's amount is negative
 *
 * @param month An ISO 8601 date string formatted as YYYY-MM
 * @returns An array of Expense objects
 */
export function getExpensesForMonth(month: string): Promise<Expense[]> {
  return new Promise((resolve, reject) => {

    const db = new sqlite3.Database(DB, error => {
      if (error) reject(error)
    })

    const sql = `
      SELECT
        P.id,
        P.description,
        P.amount,
        P.payment_date,
        C.name AS category_name
      FROM Payments P
      JOIN Categories C ON C.id = P.category_id
      WHERE P.amount < 0
      AND P.payment_date >= ?
      AND P.payment_date < ?
    `

    const params = getMonthRange(month)

    db.all(sql, params, (error, rows: ExpenseDBRow[]) => {

      if (error) {
        db.close()
        reject(error)

      } else {
        const expenses = rows.map(row => ({
          id: row.id,
          description: row.description,
          category: row.category_name,
          amount: row.amount,
          date: new Date(row.payment_date)
        }))

        db.close()
        resolve(expenses)
      }
    })
  })
}

/**
 * Get an array of NetIncome objects containing the income and expense for a given range.
 * Groups data by month-year or year.
 *
 * @param range The string "month" or "year"
 * @param start An ISO 8601 date string
 * @param end An ISO 8601 date string. End date is not inclusive.
 * @returns An array of NetIncome objects
 */
export function getNetIncome(range: NetIncomeRange, start: string, end: string): Promise<NetIncome[]> {
  return new Promise((resolve, reject) => {

    const db = new sqlite3.Database(DB, error => {
      if (error) reject(error)
    })

    const sql = `
      SELECT
        id,
        amount,
        payment_date
      FROM Payments
      WHERE payment_date >= ?
      AND payment_date < ?
    `

    const startDate = new Date(start).toISOString().slice(0, 10)
    const endDate = new Date(end).toISOString().slice(0, 10)

    db.all(sql, [startDate, endDate], (error, rows: ExpenseDBRow[]) => {

      if (error) {
        db.close()
        reject(error)

      } else {
        const expenses = rows.map(row => ({
          id: row.id,
          amount: row.amount,
          date: new Date(row.payment_date)
        }))

        let netIncomes: NetIncome[] = []
        if (range === 'month') netIncomes = getNetIncomeMonths(expenses)
        if (range === 'year') netIncomes = getNetIncomesYear(expenses)

        db.close()
        resolve(netIncomes)
      }
    })
  })
}

// IMPORTER

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
      const sql = 'INSERT INTO Categories (name) VALUES (?)'
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
  paymentDate: Date;
  amount: number;
  description: string;
  categoryId: number;
}

/**
 * Writes the data from an import CSV into the database. Locates
 * existing categories by name and creates new categories when
 * a new categeoryName is provided.
 *
 * @param rows The parsed and validated import data
 */
export async function writeToDatabase(importRows: PaymentImport[]): Promise<void> {

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

  // TODO: write payments to database

  // TODO: debug
  console.log('existingCategories\n',existingCategories)
  console.log('\payments\n',payments)

  return
}
