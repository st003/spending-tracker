import type { Categories, Expense, ExpenseCategory, ExpenseProperty } from './types'

/**
 * Takes a word and capitalizes the first letter
 *
 * @param word The word to be capitalized
 * @returns The word capitalized
 */
export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * Converts a Date to YYYY-MM-DD format string
 *
 * @param input The Date object to format
 * @returns String in format YYYY-MM-DD
 */
export function formatDateYYYYMMDD(input: Date): string {
  return input.toISOString().slice(0, 10)
}

/**
 * Converts a Date to an English Month and Year. Example:
 * 2025-05 => 'May 2025'
 *
 * @param date The Date object to format
 * @returns String in format "month YYYY"
 */
export function formatMonthLabel(date: Date): string {
  const monthName = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' })
  const expenseMonthLabel = `${monthName} ${date.getUTCFullYear()}`
  return expenseMonthLabel
}

/**
 * Formats cents into a string representation of the
 * dollar amount. Example:
 *
 * 10000 => '$100.00'
 *
 * @param value The number of cents
 * @returns String representation of the dollar amount
 */
export function formatAmount(value: number): string {
  const dollars = Math.abs(value / 100)
  return `$${dollars.toFixed(2)}`
}

/**
 * Iterates an array of expenses and computes a sum of total expenses
 * by category.
 *
 * @param expenses expenses to be summed by category
 * @returns An array of categories and their total expenses
 */
export function getTotalExpensesByCategory(expenses: Expense[]): ExpenseCategory[] {

  const categories: Categories = {}

  for (const exp of expenses) {
    if (exp.category in categories) {
      categories[exp.category] += Math.abs(exp.amount)
    } else {
      categories[exp.category] = Math.abs(exp.amount)
    }
  }

  const expenseCategories: ExpenseCategory[] = []
  for (const k in categories) {
    expenseCategories.push({ label: k, value: categories[k] })
  }

  return expenseCategories
}

/**
 * Helper function for sorting objects by property.
 *
 * @param property The object property to sort by
 * @param direction Sort asc or desc
 * @param a The evaluated object
 * @param b The compare object
 * @returns -1, 0, 1
 */
export function sortExpenseData(property: ExpenseProperty, direction: string, a: Expense, b: Expense, ): number {

  if (direction === 'asc') {
    if (a[property] < b[property]) return -1
    if (a[property] > b[property]) return 1
  }

  if (direction === 'desc') {
    if (b[property] < a[property]) return -1
    if (b[property] > a[property]) return 1
  }

  return 0
}
