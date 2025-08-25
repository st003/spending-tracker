import sqlite3 from 'sqlite3'

import { DB } from '../db/index.js'

import type { Expense, ExpenseDBRow, NetIncome, NetIncomeRange } from '../types.js'

type NetIncomeBucket = {
  [key: string]: NetIncome
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
