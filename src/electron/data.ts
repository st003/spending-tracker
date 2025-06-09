// temporary development data

import type { Expense } from './types.js'


export function getExpenses(): Expense[] {
  return [
    {
      id: 1,
      description: 'Safeway',
      category: 'Groceries',
      amount: 2216,
      date: new Date('2025-05-31')
    },
    {
      id: 2,
      description: 'Pizza Place',
      category: 'Restraunts',
      amount: 3567,
      date: new Date('2025-05-28')
    },
    {
      id: 3,
      description: 'Amazon Purchase',
      category: 'Shopping',
      amount: 6074,
      date: new Date('2025-05-28')
    },
    {
      id: 4,
      description: 'Electricity',
      category: 'Utilities',
      amount: 7000,
      date: new Date('2025-05-27')
    },
    {
      id: 5,
      description: 'Movie Ticket',
      category: 'Entertainment',
      amount: 1499,
      date: new Date('2025-05-25')
    },
    {
      id: 6,
      description: 'Safeway',
      category: 'Groceries',
      amount: 5112,
      date: new Date('2025-05-24')
    },
    {
      id: 7,
      description: 'Internet',
      category: 'Utilities',
      amount: 9000,
      date: new Date('2025-05-23')
    },
    {
      id: 8,
      description: 'Amazon Purchase',
      category: 'Shopping',
      amount: 3054,
      date: new Date('2025-05-18')
    },
    {
      id: 9,
      description: 'Safeway',
      category: 'Groceries',
      amount: 4223,
      date: new Date('2025-05-17')
    },
    {
      id: 10,
      description: 'Movie Ticket',
      category: 'Entertainment',
      amount: 1499,
      date: new Date('2025-05-14')
    },
    {
      id: 11,
      description: 'Safeway',
      category: 'Groceries',
      amount: 4989,
      date: new Date('2025-05-10')
    },
    {
      id: 12,
      description: 'Amazon Purchase',
      category: 'Shopping',
      amount: 1989,
      date: new Date('2025-05-05')
    },
    {
      id: 13,
      description: 'Safeway',
      category: 'Groceries',
      amount: 3533,
      date: new Date('2025-05-03')
    },
    {
      id: 14,
      description: 'Car Insurance',
      category: 'Insurance',
      amount: 8500,
      date: new Date('2025-05-01')
    },
    {
      id: 15,
      description: 'Mortgage Payment',
      category: 'Mortgage',
      amount: 100000,
      date: new Date('2025-05-01')
    }
  ]
}
