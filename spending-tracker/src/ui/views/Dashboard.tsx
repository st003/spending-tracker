import React, { useEffect, useState } from 'react'

import log from 'electron-log/renderer'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
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

import PaymentCategoryPieChartProps from '../components/PaymentCategoryPieChartProps'
import NetIncome from '../components/NetIncome'

import { formatMonthLabel, getLastMonth, getSumOfPaymentsByCategory } from '../utils'

import '../styles/Dashboard.css'

import type { PaymentCategory, IncomeExpense } from '../types'

function NetIncomeByMonth(): React.JSX.Element {

  // get YYYY-MM for 12 months ago
  const today = new Date()
  today.setUTCMinutes(today.getUTCMinutes() - today.getTimezoneOffset())
  today.setUTCDate(1)
  today.setUTCFullYear(today.getUTCFullYear() - 1)
  const startMonthDefault = today.toISOString().slice(0, 7)

  const endMonthDefault = getLastMonth()

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
      log.error(error)
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
       title='Net Income By Month'
       action={
        <IconButton onClick={() => setOpen(true)} title='Open Filter Settings'>
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

interface ExpensesFilterDialogProps {
  monthSelection: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  monthInputValue: string;
  setMonthInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleApply: (newMonthSelection: string) => void;
}

function ExpensesFilterDialog({ monthSelection, open, setOpen, monthInputValue, setMonthInputValue, handleApply }: ExpensesFilterDialogProps) {

  const handleMonthSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonthInputValue(event.target.value)
  }

  const handleClose = () => {
    setMonthInputValue(monthSelection)
    setOpen(false)
  }

  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={open}
    >
      <DialogTitle>Filter Settings</DialogTitle>
      <DialogContent className='ExpensesFilterDialogBody'>
        <label>Month</label>
        <div className='inputContainer'>
          <input
            type='month'
            value={monthInputValue}
            onChange={handleMonthSelectionChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleApply(monthInputValue)}>Apply</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

function ExpensesByMonth(): React.JSX.Element {

  const [monthSelection, setMonthSelection] = useState(getLastMonth())
  const [expenseMonthLabel, setExpenseMonthLabel] = useState(formatMonthLabel(monthSelection))
  const [expenseCategoryData, setExpenseCategoryData] = useState<PaymentCategory[]>([])
  const [showExpenseFilterSettings, setShowExpenseFilterSettings] = useState(false)
  const [monthInputValue, setMonthInputValue] = useState(monthSelection)

  const getExpensesCategoriesForMonth = async (window: Window, monthSelection: string): Promise<PaymentCategory[]> => {
    try {
      const expenses: Payment[] = await window.electronAPI.getExpensesForMonth(monthSelection)
      return getSumOfPaymentsByCategory(expenses)
    } catch (error) {
      log.error(error)
      return []
    }
  }

  const applyExpenseFilters = async (newMonthSelection: string) => {
    setMonthSelection(newMonthSelection)
    setExpenseMonthLabel(formatMonthLabel(newMonthSelection))
    setShowExpenseFilterSettings(false)
    const categories = await getExpensesCategoriesForMonth(window, newMonthSelection)
    setExpenseCategoryData(categories)
  }

  const changeMonth = async (n: number) => {
    const d = new Date(monthSelection)
    d.setUTCMonth(d.getUTCMonth() + n)
    const newMonth = d.toISOString().slice(0, 7)
    setMonthInputValue(newMonth)
    await applyExpenseFilters(newMonth)
  }

  useEffect(() => {
    (async () => {
      const categories = await getExpensesCategoriesForMonth(window, monthSelection)
      setExpenseCategoryData(categories)
    })()
  }, [])

  return (
    <>
      <Card variant='outlined'>
        <CardHeader
          title={`Expenses - ${expenseMonthLabel}`}
          action={
            <>
              <IconButton onClick={() => changeMonth(-1)} title='Back 1 Month'>
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton onClick={() => changeMonth(1)} title='Forward 1 Month'>
                <ArrowForwardIosIcon />
              </IconButton>
              <IconButton onClick={() => setShowExpenseFilterSettings(true)} title='Open Filter Settings'>
                <MoreVertIcon />
              </IconButton>
            </>
          }
        />
        <CardContent>
          <PaymentCategoryPieChartProps data={expenseCategoryData} />
        </CardContent>
      </Card>
      <ExpensesFilterDialog
        monthSelection={monthSelection}
        open={showExpenseFilterSettings}
        setOpen={setShowExpenseFilterSettings}
        monthInputValue={monthInputValue}
        setMonthInputValue={setMonthInputValue}
        handleApply={applyExpenseFilters}
      />
    </>
  )
}

function NetIncomeByYear(): React.JSX.Element {

  // default for start and end year
  const today = new Date()
  today.setUTCMinutes(today.getUTCMinutes() - today.getTimezoneOffset())
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
      log.error(error)
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
        title='Net Income By Year'
        action={
          <IconButton onClick={() => setOpen(true)} title='Open Filter Settings'>
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
      <h1 style={{ marginBottom: '1rem' }}>Dashboard</h1>
      <NetIncomeByMonth />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ExpensesByMonth />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <NetIncomeByYear />
        </Grid>
      </Grid>
    </div>
  )
}
