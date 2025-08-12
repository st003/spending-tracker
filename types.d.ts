type NetIncome = {
  income: number;
  expense: number;
  range: string;
}

interface Window {
  electronAPI: {
    getNetIncome: (range: 'month'|'year', start: string, end: string) => Promise<NetIncome[]>
  }
}
