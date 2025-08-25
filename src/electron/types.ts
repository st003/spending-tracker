export type Expense = {
  id: number
  description?: string
  category?: string
  amount: number
  date: Date
}

// TODO: convert this to Payment in db types?
export type ExpenseDBRow = {
  id: number;
  description: string;
  amount: number;
  payment_date: string;
  category_name: string;
}

export type NetIncome = {
  income: number
  expense: number
  range: string
}

export type NetIncomeRange = 'month'|'year'
