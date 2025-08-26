import { PieChart } from '@mui/x-charts/PieChart'

import { formatAmount } from '../utils'

import type { ExpenseCategory } from '../types'

type ExpenseProps = {
  data: ExpenseCategory[];
}

export default function Expense({ data }: ExpenseProps) {

  const expenseSeries = [
    {
      cornerRadius: 5,
      data: data,
      innerRadius: 50,
      paddingAngle: 1,
      valueFormatter: (category: any) => formatAmount(category.value)
    }
  ]

  return <PieChart series={expenseSeries} height={300} hideLegend />
}
