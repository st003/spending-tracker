// DATA

export type Expense = {
  id: number
  description?: string
  category?: string
  amount: number
  date: Date
}

export type NetIncome = {
  income: number
  expense: number
  range: string
}

export type NetIncomeBucket = {
  [key: string]: NetIncome
}

export type NetIncomeRange = 'month'|'year'
