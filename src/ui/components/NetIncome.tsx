import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

import { BarPlot } from '@mui/x-charts/BarChart'
import { ChartContainer } from '@mui/x-charts/ChartContainer'
import { ChartsGrid } from '@mui/x-charts/ChartsGrid'
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip'
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis'
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis'
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart'

import { getMonthLabels, getYearLabels } from '../utils'

import type { IncomeExpense } from '../types'

type NetIncomeProps = {
  scale: 'Month' | 'Year';
  data: IncomeExpense;
}

export default function NetIncome({ scale, data }: NetIncomeProps) {

  const series: any[] = [
    {
      color: '#a3de83',
      data: data.income,
      label: 'Income',
      stack: 'diverging',
      type: 'bar',
      valueFormatter: (val: number) => `$${val}`
    },
    {
      color: '#ff5d6e',
      data: data.expense,
      label: 'Expense',
      stack: 'diverging',
      type: 'bar',
      valueFormatter: (val: number) => `$${Math.abs(val)}`
    },
    {
      color: '#4254fb',
      curve: 'linear',
      data: data.income.map((val, i) => val + data.expense[i]),
      label: 'Net',
      type: 'line',
      valueFormatter: (val: number) => `$${Math.abs(val)}`
    }
  ]

  let xAxisData: any[]
  switch(scale) {
    case 'Month':
      // TODO: make this dynamic based on the length of the series
      // as well as adding the year (ex: May '25)
      xAxisData = getMonthLabels()
      break
    case 'Year':
      xAxisData = getYearLabels(data.income.length)
      break
    default:
      xAxisData = []
  }

  const xAxis: any[] = [
    {
      data: xAxisData,
      id: 'xAxis',
      scaleType: 'band'
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
            <ChartsGrid horizontal />
            <BarPlot borderRadius={3} />
            <LinePlot />
            <MarkPlot />
            <ChartsTooltip />
            <ChartsXAxis axisId='xAxis' />
            <ChartsYAxis axisId='yAxis' />
          </ChartContainer>
      </CardContent>
    </Card>
  )
}
