import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

import Expense from '../components/Expense'
import NetIncome from '../components/NetIncome'

import { getTotalExpensesByCategory } from '../utils'

import '../styles/dashboard.css'

import type { ExpenseCategory, IncomeExpense } from '../types'

export default function Dashboard() {

  // net income month chart
  const [monthData, setMonthData] = useState<IncomeExpense>({ income: [], expense: [] })
  const [monthXAxis, setMonthXAxis] = useState<string[]>([])

  useEffect(() => {
    (async () => {
      try {
        // @ts-ignore
        const result = await window.electronAPI.getNetIncome('month')

        const data: IncomeExpense = { income: [], expense: [] }
        const xAxis: string[] = []

        for (const month of result) {
          data.income.push(month.income)
          data.expense.push(month.expense)
          xAxis.push(month.range)
        }

        setMonthData(data)
        setMonthXAxis(xAxis)

      } catch (error) {
        // TODO: improve error handling
        console.error(error)
      }
    })()
  }, [])

  // expenses chart
  const [expenseData, setExpenseData] = useState<ExpenseCategory[]>([])

  const today = new Date()
  today.setMonth(today.getMonth() - 1)
  const monthName = today.toLocaleString('default', { month: 'long' })
  const expenseMonth = `${monthName} ${today.getFullYear()}`

  useEffect(() => {
    (async () => {
      try {
        // @ts-ignore
        const result = await window.electronAPI.getExpenses()
        const categories = getTotalExpensesByCategory(result)
        setExpenseData(categories)
      } catch (error) {
        // TODO: improve error handling
        console.error(error)
      }
    })()
  }, [])

  // net income year chart

    const [yearData, setYearData] = useState<IncomeExpense>({ income: [], expense: [] })
  const [yearXAxis, setYearXAxis] = useState<string[]>([])

  useEffect(() => {
    (async () => {
      try {
        // @ts-ignore
        const result = await window.electronAPI.getNetIncome('year')

        console.log(result)

        const data: IncomeExpense = { income: [], expense: [] }
        const xAxis: string[] = []

        for (const month of result) {
          data.income.push(month.income)
          data.expense.push(month.expense)
          xAxis.push(month.range)
        }

        setYearData(data)
        setYearXAxis(xAxis)

      } catch (error) {
        // TODO: improve error handling
        console.error(error)
      }
    })()
  }, [])

  return (
    <div className='dashboard'>
      <h1>Dashboard</h1>
      <Card variant='outlined' sx={{ mb: 2 }}>
        <CardHeader title='Net Income (By Month)' />
        <CardContent>
          <NetIncome data={monthData} xAxis={monthXAxis} />
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        <Grid size={{ sm: 12, lg: 6 }}>
          <Card variant='outlined'>
            <CardHeader title={`Expenses (${expenseMonth})`} />
            <CardContent>
              <Expense data={expenseData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ sm: 12, lg: 6 }}>
          <Card variant='outlined' sx={{ mb: 2 }}>
            <CardHeader title='Net Income (By Year)' />
            <CardContent>
              <NetIncome data={yearData} xAxis={yearXAxis} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
