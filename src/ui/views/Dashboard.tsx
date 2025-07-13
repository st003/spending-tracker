import React, { useEffect, useState } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
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

  // default for end month
  const today = new Date()
  today.setUTCMonth(today.getUTCMonth() - 1)
  const endMonthDefault = today.toISOString().slice(0, 7)

  // default for start month
  today.setUTCMonth(today.getUTCMonth() + 1)
  today.setUTCFullYear(today.getUTCFullYear() - 1)
  const startMonthDefault = today.toISOString().slice(0, 7)

  const [open, setOpen] = useState(false)
  const [startMonthInput, setStartMonthInput] = useState(startMonthDefault)
  const [endMonthInput, setEndMonthInput] = useState(endMonthDefault)

  const [startMonthInputCopy, setStartMonthInputCopy] = useState(startMonthDefault)
  const [endMonthInputCopy, setEndMonthInputCopy] = useState(endMonthDefault)

  const [monthData, setMonthData] = useState<IncomeExpense>({ income: [], expense: [] })
  const [monthXAxis, setMonthXAxis] = useState<string[]>([])

  const getNetIncome = async (startMonth: string, endMonth: string) => {
    try {

      const startDate = new Date(startMonth).toISOString().slice(0, 10)

      const temp = new Date(endMonth)
      temp.setUTCMonth(temp.getUTCMonth() + 1)
      const endDate = temp.toISOString().slice(0, 10)

      // TODO: fix type safety
      // @ts-ignore
      const result = await window.electronAPI.getNetIncome('month', startDate, endDate)

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
      console.error(error)
      setMonthData({ income: [], expense: [] })
      setMonthXAxis([])
    }
  }

  const handleStartMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartMonthInput(event.target.value)
  }

  const handleEndMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndMonthInput(event.target.value)
  }

  const handleClose = () => {
    setOpen(false)
    setStartMonthInput(startMonthInputCopy)
    setEndMonthInput(endMonthInputCopy)
  }

  const handleApply = async (startMonth: string, endMonth: string) => {
    await getNetIncome(startMonth, endMonth)
    setOpen(false)
    setStartMonthInputCopy(startMonth)
    setEndMonthInputCopy(endMonth)
  }

  useEffect(() => {
    (async () => await getNetIncome(startMonthInput, endMonthInput))()
  }, [])

  return (
    <Card variant='outlined' sx={{ mb: 2 }}>
      <CardHeader
       title='Net Income (By Month)'
       action={
        <IconButton onClick={() => setOpen(true)}>
          <MoreVertIcon />
        </IconButton>
       }
      />
      <CardContent>
        <NetIncome data={monthData} xAxis={monthXAxis} />
      </CardContent>
      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
      >
        <DialogTitle>Filter Settings</DialogTitle>
        <DialogContent className='NetIncomeFilters'>
          <label>Start Month</label>
          <div className='inputContainer'>
            <input
              type='month'
              value={startMonthInput}
              onChange={handleStartMonthChange}
            />
          </div>
          <label>End Month</label>
          <div className='inputContainer'>
            <input
              type='month'
              value={endMonthInput}
              onChange={handleEndMonthChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleApply(startMonthInput, endMonthInput)}>Apply</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
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
      // TODO: fix type safety
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

  // default for start and end year
  const today = new Date()
  const startYearDefault = today.getUTCFullYear() - 5
  const endYearDefault = today.getUTCFullYear() - 1

  const [open, setOpen] = useState(false)
  const [startYearInput, setStartYearInput] = useState(startYearDefault)
  const [endYearInput, setEndYearInput] = useState(endYearDefault)

  const [startYearInputCopy, setStartYearInputCopy] = useState(startYearDefault)
  const [endYearInputCopy, setEndYearInputCopy] = useState(endYearDefault)

  const [yearData, setYearData] = useState<IncomeExpense>({ income: [], expense: [] })
  const [yearXAxis, setYearXAxis] = useState<string[]>([])

  const getNetIncome = async (startYear: number, endYear: number) => {
    try {

      const startDate = new Date(startYear.toString()).toISOString().slice(0, 10)

      const temp = new Date(endYear.toString())
      temp.setUTCFullYear(temp.getUTCFullYear() + 1)
      const endDate = temp.toISOString().slice(0, 10)

      // TODO: fix type safety
      // @ts-ignore
      const result = await window.electronAPI.getNetIncome('year', startDate, endDate)

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
      console.error(error)
      setYearData({ income: [], expense: [] })
      setYearXAxis([])
    }
  }

  const handleStartYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartYearInput(Number(event.target.value))
  }

  const handleEndYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndYearInput(Number(event.target.value))
  }

  const handleClose = () => {
    setOpen(false)
    setStartYearInput(startYearInputCopy)
    setEndYearInput(endYearInputCopy)
  }

  const handleApply = async (startYear: number, endYear: number) => {
    await getNetIncome(startYear, endYear)
    setOpen(false)
    setStartYearInputCopy(startYear)
    setEndYearInputCopy(endYear)
  }

  useEffect(() => {
    (async () => await getNetIncome(startYearInput, endYearInput))()
  }, [])

  return (
    <Card variant='outlined' sx={{ mb: 2 }}>
      <CardHeader
        title='Net Income (By Year)'
        action={
          <IconButton onClick={() => setOpen(true)}>
            <MoreVertIcon />
          </IconButton>
       }
      />
      <CardContent>
        <NetIncome data={yearData} xAxis={yearXAxis} />
      </CardContent>
      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
      >
        <DialogTitle>Filter Settings</DialogTitle>
        <DialogContent className='NetIncomeFilters'>
          <label>Start Year</label>
          <div className='inputContainer'>
            <input
              type='number'
              value={startYearInput}
              onChange={handleStartYearChange}
            />
          </div>
          <label>End Year</label>
          <div className='inputContainer'>
            <input
              type='number'
              value={endYearInput}
              onChange={handleEndYearChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleApply(startYearInput, endYearInput)}>Apply</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
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
