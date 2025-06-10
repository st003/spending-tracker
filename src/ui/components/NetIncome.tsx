import { BarPlot } from '@mui/x-charts/BarChart'
import { ChartContainer } from '@mui/x-charts/ChartContainer'
import { ChartsGrid } from '@mui/x-charts/ChartsGrid'
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip'
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis'
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis'
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart'

import { formatAmount } from '../utils'

import type { IncomeExpense } from '../types'

type NetIncomeProps = {
  data: IncomeExpense;
  xAxis: string[];
}

export default function NetIncome({ data, xAxis }: NetIncomeProps) {

  const series: any[] = [
    {
      color: '#a3de83',
      data: data.income,
      label: 'Income',
      stack: 'diverging',
      type: 'bar',
      valueFormatter: (val: number) => formatAmount(val)
    },
    {
      color: '#ff5d6e',
      data: data.expense,
      label: 'Expense',
      stack: 'diverging',
      type: 'bar',
      valueFormatter: (val: number) => formatAmount(val)
    },
    {
      color: '#4254fb',
      curve: 'linear',
      data: data.income.map((val, i) => val + data.expense[i]),
      label: 'Net',
      type: 'line',
      valueFormatter: (val: number) => formatAmount(val)
    }
  ]

  const xAxisConfig: any[] = [
    {
      data: xAxis,
      id: 'xAxis',
      scaleType: 'band'
    }
  ]

  const yAxisConfig: any[] = [
    {
      id: 'yAxis',
      width: 60,
      valueFormatter: (val: number) => (val >= 0) ? `$${val / 100}` : `-$${Math.abs(val / 100)}`
    }
  ]

  return (
    <ChartContainer
      series={series}
      xAxis={xAxisConfig}
      yAxis={yAxisConfig}
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
  )
}
