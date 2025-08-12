type Expense = {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: Date;
}

type NetIncome = {
  income: number;
  expense: number;
  range: string;
}

interface Window {
  electronAPI: {
    openImporter: (callback: (value: true) => void) => void,
    getExpensesForMonth: (isoYYYYMM: string) => Promise<Expense[]>,
    getNetIncome: (range: 'month'|'year', start: string, end: string) => Promise<NetIncome[]>
  }
}
