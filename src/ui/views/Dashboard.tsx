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
  const monthData: IncomeExpense = {
    income: [4500, 4600, 5000, 4500, 4700, 4800, 4500, 4500, 4900, 4600, 4500, 5000],
    expense: [-2500, -2500, -3000, -5000, -3000, -2500, -2000, -2500, -2700, -2900, -3300, -4500]
  }

  const monthXAxis = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
  const yearData: IncomeExpense = {
    income: [4500, 4600, 5000, 4500, 4700],
    expense: [-2500, -2500, -3000, -5000, -3000]
  }

  const yearXAxis = ['2020', '2021', '2022', '2023', '2024']

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
