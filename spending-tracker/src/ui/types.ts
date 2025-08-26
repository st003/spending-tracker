export type Categories = {
  [key: string]: number
}

export type ExpenseCategory = {
  label: string;
  value: number;
}

export type ExpenseProperty = 'id'|'description'|'category'|'amount'|'date'

export type IncomeExpense = {
  income: number[];
  expense: number[];
}

export type OrderByDirection = 'asc'|'desc'
