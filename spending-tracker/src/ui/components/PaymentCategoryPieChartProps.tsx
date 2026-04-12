import { PieChart } from '@mui/x-charts/PieChart'
import { greenPalette, redPalette } from '@mui/x-charts/colorPalettes';

import { formatAmount } from '../utils'

import type { PaymentCategory } from '../types'

interface PaymentCategoryPieChartProps {
  data: PaymentCategory[]
  pos: boolean
}

export default function PaymentCategoryPieChart({ data, pos }: PaymentCategoryPieChartProps) {

  const paymentCategorySeries = [
    {
      cornerRadius: 5,
      data: data,
      innerRadius: 50,
      paddingAngle: 1,
      valueFormatter: (category: any) => formatAmount(category.value)
    }
  ]

  const palette = pos ? greenPalette : redPalette

  return <PieChart series={paymentCategorySeries} colors={palette} height={300} hideLegend />
}
