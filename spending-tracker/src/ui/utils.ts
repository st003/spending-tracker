import type { Categories, PaymentCategory, PaymentProperty } from './types'

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
 * Converts a YYYY-MM formatted ISO string to an English Month and Year. Example:
 * 2025-05 => 'May 2025'
 *
 * @param date The YYYY-MM formatted ISO string
 * @returns String in format "Month YYYY"
 */
export function formatMonthLabel(date: string): string {
  const dt = new Date(date);
  const monthName = dt.toLocaleString('default', { month: 'long', timeZone: 'UTC' })
  const expenseMonthLabel = `${monthName} ${dt.getUTCFullYear()}`
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
  return '$' + Math.abs(value / 100).toFixed(2)
}

/**
 * Formats cents into a string representation of the
 * dollar amount. Example:
 *
 * 10000 => '+$100.00'
 * -10000 -> '-$100.00'
 *
 * @param value The number of cents
 * @returns String representation of the dollar amount
 */
export function formatSignedAmount(value: number): string {
  const fmt = '$' + Math.abs(value / 100).toFixed(2)
  if (value > 0) return ('+' + fmt)
  return ('-' + fmt)
}

/**
 * Get's the year and month for the previous month relative to
 * today's date.
 *
 * @returns An ISO string formatted at YYYY-MM
 */
export function getLastMonth(): string {
  const today = new Date()
  today.setUTCMinutes(today.getUTCMinutes() - today.getTimezoneOffset())
  today.setUTCDate(1)
  today.setUTCMonth(today.getUTCMonth() - 1)
  return today.toISOString().slice(0, 7)
}

/**
 * Iterates an array of Payments and computes a sum of total Payments
 * by Category.
 *
 * @param payments Payments to be summed by category
 * @returns An array of categories and their total Payments
 */
export function getSumOfPaymentsByCategory(payments: Payment[]): PaymentCategory[] {

  const categories: Categories = {}

  for (const exp of payments) {
    if (exp.category in categories) {
      categories[exp.category] += Math.abs(exp.amount)
    } else {
      categories[exp.category] = Math.abs(exp.amount)
    }
  }

  const paymentCategories: PaymentCategory[] = []
  for (const k in categories) {
    paymentCategories.push({ label: k, value: categories[k] })
  }

  return paymentCategories
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
export function sortPaymentData(property: PaymentProperty, direction: string, a: Payment, b: Payment, ): number {

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
