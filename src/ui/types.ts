export type Expense = {
  desc: string;
  category: string;
  amount: string;
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
