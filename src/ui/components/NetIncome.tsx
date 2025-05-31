import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

import { BarPlot } from '@mui/x-charts/BarChart'
import { ChartContainer } from '@mui/x-charts/ChartContainer'
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis'
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis'
import { LinePlot } from '@mui/x-charts/LineChart'

import { MONTHS } from '../constants'
import { getLast5Years } from '../utils'

import type { IncomeExpense } from '../types'

type NetIncomeProps = {
  scale: 'Month' | 'Year';
  data: IncomeExpense;
}

export default function NetIncome({ scale, data }: NetIncomeProps) {

  const series: any[] = [
    {
      type: 'bar',
      data: data.income,
      label: 'Income',
      stack: 'diverging',
      color: '#a3de83'
    },
    {
      type: 'bar',
      data: data.expense,
      label: 'Expense',
      stack: 'diverging',
      color: '#ff5d6e'
    },
    {
      type: 'line',
      data: data.income.map((val, i) => val + data.expense[i]),
      color: '#4254fb'
    }
  ]

  let xAxisData: any[]
  switch(scale) {
    case 'Month':
      xAxisData = MONTHS
      break
    case 'Year':
      xAxisData = getLast5Years()
      break
    default:
      xAxisData = []
  }

  const xAxis: any[] = [
    {
      id: 'xAxis',
      scaleType: 'band',
      data: xAxisData
    }
  ]

  return (
    <Card variant='outlined' sx={{ mb: 2 }}>
      <CardHeader title={`Net Income (by ${scale})`} />
        <CardContent>
          <ChartContainer
            series={series}
            xAxis={xAxis}
            yAxis={[{ id: 'yAxis'}]}
            height={300}
          >
            <BarPlot />
            <LinePlot />
            <ChartsXAxis axisId='xAxis' />
            <ChartsYAxis axisId='yAxis' />
          </ChartContainer>
      </CardContent>
    </Card>
  )
}
