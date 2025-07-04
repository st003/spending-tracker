import sqlite3 from 'sqlite3'

import { getMonthRange, getNetIncomeMonths, getNetIncomesYear } from './utils.js'

import type { Expense, NetIncome, NetIncomeRange } from './types.js'

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

    const db = new sqlite3.Database('data.db', error => {
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

    const db = new sqlite3.Database('data.db', error => {
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
