// temporary development data

import type { Expense, NetIncome, NetIncomeRange } from './types.js'


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


export function getNetIncome(range: NetIncomeRange): NetIncome[] {

  if (range === 'month') {
    return [
      {
        income: 450_000,
        expense: -250_000,
        range: 'Jan \'24'
      },
      {
        income: 470_000,
        expense: -230_000,
        range: 'Feb \'24'
      },
      {
        income: 500_000,
        expense: -300_000,
        range: 'Mar \'24'
      },
      {
        income: 450_000,
        expense: -300_000,
        range: 'Apr \'24'
      },
      {
        income: 470_000,
        expense: -500_000,
        range: 'May \'24'
      },
      {
        income: 480_000,
        expense: -300_000,
        range: 'Jun \'24'
      },
      {
        income: 450_000,
        expense: -250_000,
        range: 'Jul \'24'
      },
      {
        income: 490_000,
        expense: -200_000,
        range: 'Aug \'24'
      },
      {
        income: 460_000,
        expense: -277_000,
        range: 'Sep \'24'
      },
      {
        income: 450_000,
        expense: -250_000,
        range: 'Oct \'24'
      },
      {
        income: 450_000,
        expense: -330_000,
        range: 'Nov \'24'
      },
      {
        income: 550_000,
        expense: -450_000,
        range: 'Dec \'24'
      }
    ]
  }

  if (range === 'year') {
    return [
      {
        income: 5_500_000,
        expense: -4_500_000,
        range: '2020'
      },
      {
        income: 6_200_000,
        expense: -4_800_000,
        range: '2021'
      },
      {
        income: 7_000_000,
        expense: -5_300_000,
        range: '2022'
      },
      {
        income: 7_000_000,
        expense: -5_500_000,
        range: '2023'
      },
      {
        income: 8_800_000,
        expense: -5_000_000,
        range: '2024'
      }
    ]
  }

  return []
}
