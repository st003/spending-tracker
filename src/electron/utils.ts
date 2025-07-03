import path from 'path'

import { app } from 'electron'

import type { Expense, NetIncome } from './types.js'

/**
 * Because preload scripts are injected into the frontend they will reside
 * in different locations during dev and in a package. This function dynamically
 * returns the correct path based on the current environment
 *
 * @returns The path to the preload script
 */
export function getPreloadScriptPath(): string {
  return path.join(
    app.getAppPath(),
    (process.env.NODE_ENV === 'development') ? '.' : '..',
    '/dist-electron/preload.cjs'
  )
}

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
export function getMonthRange(isoYYYYMM: string): string[] {

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

type NetIncomeMonths = {
  [key: string]: NetIncome
}

/**
 * Groups expenses in from the same month-year into a NetIncome object and returns
 * each month's NetIncome.
 *
 * @param expenses An array of Expenses
 * @returns An array of NetIncomes
 */
export function getNetIncomeMonths(expenses: Expense[]): NetIncome[] {

  const months: NetIncomeMonths = {}

  for (const exp of expenses) {
    // use "YYYY-MM" as the object key
    const yearMonthKey = new Date(exp.date).toISOString().slice(0, 7)
    if (yearMonthKey in months) {
      if (exp.amount > 0) months[yearMonthKey].income += exp.amount
      else months[yearMonthKey].expense += exp.amount

    } else {
      const month = {
        income: 0,
        expense: 0,
        range: yearMonthKey // TODO: temp, format example "Jan '25"
      }

      if (exp.amount > 0) month.income += exp.amount
      else month.expense += exp.amount

      months[yearMonthKey] = month
    }
  }

  // TODO: how do I garuntee a correct sort order oldest to newest?
  return Object.values(months)
}