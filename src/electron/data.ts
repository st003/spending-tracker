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
    // TODO: <= or < for end date?

    db.all(sql, [start, end], (error, rows: ExpenseDBRow[]) => {

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
