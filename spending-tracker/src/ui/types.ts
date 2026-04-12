export type Categories = {
  [key: string]: number
}

export type PaymentCategory = {
  label: string;
  value: number;
}

export type PaymentProperty = 'id'|'description'|'category'|'amount'|'date'

export type IncomeExpense = {
  income: number[];
  expense: number[];
}

export type OrderByDirection = 'asc'|'desc'
