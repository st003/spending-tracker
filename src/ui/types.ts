export type Categories = {
  [key: string]: number
}

export type Expense = {
  desc: string;
  category: string;
  amount: number;
  date: string;
}

export type ExpenseCategory = {
  value: number;
  label: string;
}

export type IncomeExpense = {
  income: number[];
  expense: number[];
}
