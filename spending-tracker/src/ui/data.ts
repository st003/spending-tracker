import { getTotalExpensesByCategory } from './utils'

import type { ExpenseCategory } from './types'

export async function getExpensesCategoriesForMonth(window: Window, monthSelection: string): Promise<ExpenseCategory[]> {
  try {
    const result: Expense[] = await window.electronAPI.getExpensesForMonth(monthSelection)
    return getTotalExpensesByCategory(result)
  } catch (error) {
    // TODO: can this be logged to the file system?
    console.error(error)
    return []
  }
}
