import { PieChart } from '@mui/x-charts/PieChart'
import { blueberryTwilightPalette } from '@mui/x-charts/colorPalettes';

import { formatAmount } from '../utils'

import type { PaymentCategory } from '../types'

type PaymentCategoryPieChartProps = {
  data: PaymentCategory[];
}

export default function PaymentCategoryPieChart({ data }: PaymentCategoryPieChartProps) {

  const paymentCategorySeries = [
    {
      cornerRadius: 5,
      data: data,
      innerRadius: 50,
      paddingAngle: 1,
      valueFormatter: (category: any) => formatAmount(category.value)
    }
  ]

  return <PieChart series={paymentCategorySeries} colors={blueberryTwilightPalette} height={300} hideLegend />
}
