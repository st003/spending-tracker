// temporary development data

import type { Categories, Expense, ExpenseCategory } from './types'


export const expenses: Expense[] = [
  {
    desc: 'Electric Bill',
    category: 'Utilities',
    amount: 70.0,
    date: '2025-05-27'
  },
  {
    desc: 'Internet Bill',
    category: 'Utilities',
    amount: 90.0,
    date: '2025-05-23'
  },
  {
    desc: 'Movie Tickets',
    category: 'Entertainment',
    amount: 14.99,
    date: '2025-05-14'
  },
  {
    desc: 'Amazon Purchase',
    category: 'Shopping',
    amount: 30.54,
    date: '2025-05-05'
  },
  {
    desc: 'Safeway',
    category: 'Groceries',
    amount: 49.89,
    date: '2025-05-02'
  }
]


export function getExpensesByCategory(expenses: Expense[]): ExpenseCategory[] {

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
