import type { Categories, Expense, ExpenseCategory } from './types'


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
