import { getTotalExpensesByCategory } from './utils'

import type { ExpenseCategory } from './types'

export async function getExpensesForMonth(window: Window, monthSelection: string): Promise<ExpenseCategory[]> {
  try {
    // TODO: fix type safety
    // @ts-ignore
    const result = await window.electronAPI.getExpensesForMonth(monthSelection)
    return getTotalExpensesByCategory(result)
  } catch (error) {
    console.error(error)
    return []
  }
}
