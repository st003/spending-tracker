import type { Categories, Expense, ExpenseCategory, ExpenseProperty } from './types'

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * Converts Date to YYYY-MM-DD format string
 *
 * @param input The Date object to format
 * @returns string in format YYYY-MM-DD
 */
export function formatDate(input: Date): string {
  return input.toISOString().slice(0, 10)
}

export function formatAmount(value: number): string {
  const dollars = Math.abs(value / 100)
  return `$${dollars.toFixed(2)}`
}

export function getTotalExpensesByCategory(expenses: Expense[]): ExpenseCategory[] {

  const categories: Categories = {}

  for (const exp of expenses) {
    if (exp.category in categories) {
      categories[exp.category] += exp.amount
    } else {
      categories[exp.category] = exp.amount
    }
  }

  const expenseCategories: ExpenseCategory[] = []
  for (const key in categories) {
    expenseCategories.push({ value: categories[key], label: key })
  }

  return expenseCategories
}

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
