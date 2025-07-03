import { useEffect, useState } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'

import BudgetFilterDialog from '../components/BudgetFIlterDialog'
import Expense from '../components/Expense'
import NetIncome from '../components/NetIncome'

import { getExpensesForMonth } from '../data'
import { formatMonthLabel } from '../utils'

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
  const today = new Date()
  today.setUTCMonth(today.getUTCMonth() - 1)

  const [monthSelection, setMonthSelection] = useState(today.toISOString().slice(0, 7))
  const [expenseMonthLabel, setExpenseMonthLabel] = useState(formatMonthLabel(today))
  const [expenseData, setExpenseData] = useState<ExpenseCategory[]>([])
  const [showExpenseFilterSettings, setShowExpenseFilterSettings] = useState(false)

  const applyExpenseFilters = async (newMonthSelection: string) => {
    setMonthSelection(newMonthSelection)
    setExpenseMonthLabel(formatMonthLabel(new Date(newMonthSelection)))
    setShowExpenseFilterSettings(false)
    const categories = await getExpensesForMonth(window, newMonthSelection)
    setExpenseData(categories)
  }

  useEffect(() => {
    (async () => {
      // @ts-ignore
      const categories = await getExpensesForMonth(window, monthSelection)
      setExpenseData(categories)
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
            <CardHeader
              title={`Expenses (${expenseMonthLabel})`}
              action={
                <IconButton onClick={() => setShowExpenseFilterSettings(true)}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Expense data={expenseData} />
            </CardContent>
          </Card>
          <BudgetFilterDialog
            open={showExpenseFilterSettings}
            setOpen={setShowExpenseFilterSettings}
            monthSelection={monthSelection}
            handleApply={applyExpenseFilters}
          />
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
