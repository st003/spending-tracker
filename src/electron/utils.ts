import path from 'path'

import { app } from 'electron'

import type { Expense, NetIncome, NetIncomeBucket } from './types.js'

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
