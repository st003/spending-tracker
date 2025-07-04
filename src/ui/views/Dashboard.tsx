import React, { useEffect, useState } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'

import BudgetFilterDialog from '../components/BudgetFIlterDialog'
import Expense from '../components/Expense'
import NetIncome from '../components/NetIncome'

import { getExpensesCategoriesForMonth } from '../data'
import { formatMonthLabel } from '../utils'

import '../styles/Dashboard.css'

import type { ExpenseCategory, IncomeExpense } from '../types'

function NetIncomeByMonth(): React.JSX.Element {

  const [monthData, setMonthData] = useState<IncomeExpense>({ income: [], expense: [] })
  const [monthXAxis, setMonthXAxis] = useState<string[]>([])

  useEffect(() => {
    (async () => {
      try {
        // @ts-ignore
        const result = await window.electronAPI.getNetIncome('month', '2021-12-01', '2022-11-01')

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

  return (
    <Card variant='outlined' sx={{ mb: 2 }}>
      <CardHeader title='Net Income (By Month)' />
      <CardContent>
        <NetIncome data={monthData} xAxis={monthXAxis} />
      </CardContent>
    </Card>
  )
}

function ExpensesByMonth(): React.JSX.Element {

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
    const categories = await getExpensesCategoriesForMonth(window, newMonthSelection)
    setExpenseData(categories)
  }

  useEffect(() => {
    (async () => {
      // @ts-ignore
      const categories = await getExpensesCategoriesForMonth(window, monthSelection)
      setExpenseData(categories)
    })()
  }, [])

  return (
    <>
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
    </>
  )
}

function NetIncomeByYear(): React.JSX.Element {

  const [yearData, setYearData] = useState<IncomeExpense>({ income: [], expense: [] })
  const [yearXAxis, setYearXAxis] = useState<string[]>([])

  useEffect(() => {
    (async () => {
      try {
        // @ts-ignore
        const result = await window.electronAPI.getNetIncome('year', '2018-01-01', '2023-01-01')

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
    <Card variant='outlined' sx={{ mb: 2 }}>
      <CardHeader title='Net Income (By Year)' />
      <CardContent>
        <NetIncome data={yearData} xAxis={yearXAxis} />
      </CardContent>
    </Card>
  )
}

export default function Dashboard(): React.JSX.Element {

  return (
    <div className='dashboard'>
      <h1>Dashboard</h1>
      <NetIncomeByMonth />
      <Grid container spacing={2}>
        <Grid size={{ sm: 12, lg: 6 }}>
          <ExpensesByMonth />
        </Grid>
        <Grid size={{ sm: 12, lg: 6 }}>
          <NetIncomeByYear />
        </Grid>
      </Grid>
    </div>
  )
}
