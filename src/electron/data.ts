import sqlite3 from 'sqlite3'

import { getMonthRange } from './utils.js'

import type { Expense, NetIncome, NetIncomeRange } from './types.js'

type ExpenseDBRow = {
  id: number;
  description: string;
  amount: number;
  payment_date: string;
  category_name: string;
}

export function getExpenses(month: string): Promise<Expense[]> {

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
      WHERE P.payment_date >= ? AND P.payment_date < ?
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

export function getNetIncome(range: NetIncomeRange): NetIncome[] {

  if (range === 'month') {
    return [
      {
        income: 450_000,
        expense: -250_000,
        range: 'Jan \'24'
      },
      {
        income: 470_000,
        expense: -230_000,
        range: 'Feb \'24'
      },
      {
        income: 500_000,
        expense: -300_000,
        range: 'Mar \'24'
      },
      {
        income: 450_000,
        expense: -300_000,
        range: 'Apr \'24'
      },
      {
        income: 470_000,
        expense: -500_000,
        range: 'May \'24'
      },
      {
        income: 480_000,
        expense: -300_000,
        range: 'Jun \'24'
      },
      {
        income: 450_000,
        expense: -250_000,
        range: 'Jul \'24'
      },
      {
        income: 490_000,
        expense: -200_000,
        range: 'Aug \'24'
      },
      {
        income: 460_000,
        expense: -277_000,
        range: 'Sep \'24'
      },
      {
        income: 450_000,
        expense: -250_000,
        range: 'Oct \'24'
      },
      {
        income: 450_000,
        expense: -330_000,
        range: 'Nov \'24'
      },
      {
        income: 550_000,
        expense: -450_000,
        range: 'Dec \'24'
      }
    ]
  }

  if (range === 'year') {
    return [
      {
        income: 5_500_000,
        expense: -4_500_000,
        range: '2020'
      },
      {
        income: 6_200_000,
        expense: -4_800_000,
        range: '2021'
      },
      {
        income: 7_000_000,
        expense: -5_300_000,
        range: '2022'
      },
      {
        income: 7_000_000,
        expense: -5_500_000,
        range: '2023'
      },
      {
        income: 8_800_000,
        expense: -5_000_000,
        range: '2024'
      }
    ]
  }

  return []
}
