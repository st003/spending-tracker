import { getTotalExpensesByCategory } from './utils'

import type { Expense, ExpenseCategory } from './types'

export async function getExpensesForMonth(window: Window, monthSelection: string): Promise<ExpenseCategory[]> {
  try {
    // TODO: fix type safety
    // @ts-ignore
    const result: Expense[] = await window.electronAPI.getExpensesForMonth(monthSelection)
    return getTotalExpensesByCategory(result)
  } catch (error) {
    console.error(error)
    return []
  }
}
