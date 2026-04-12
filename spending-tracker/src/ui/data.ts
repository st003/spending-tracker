import log from 'electron-log/renderer'

import { getTotalExpensesByCategory } from './utils'

import type { PaymentCategory } from './types'

export async function getExpensesCategoriesForMonth(window: Window, monthSelection: string): Promise<PaymentCategory[]> {
  try {
    const result: Payment[] = await window.electronAPI.getExpensesForMonth(monthSelection)
    return getTotalExpensesByCategory(result)
  } catch (error) {
    log.error(error)
    return []
  }
}
