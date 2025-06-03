import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

import Expense from '../components/Expense'
import NetIncome from '../components/NetIncome'

import '../styles/dashboard.css'

import type { IncomeExpense } from '../types'
import { useMemo } from 'react'


export default function Dashboard() {

  const monthData: IncomeExpense = {
    income: [45, 46, 50, 45, 47, 48, 45, 45, 49, 46, 45, 50],
    expense: [-25, -25, -30, -50, -30, -25, -20, -25, -27, -29, -33, -45]
  }

  const monthXAxis = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const expenseMonth = useMemo(() => {
    const today = new Date()
    today.setMonth(today.getMonth() - 1)
    const monthName = today.toLocaleString('default', { month: 'long' })
    return `${monthName} ${today.getFullYear()}`
  }, [])

  const expenseData = [
    { value: 100, label: 'Category 1' },
    { value: 150, label: 'Category 2' },
    { value: 200, label: 'Category 3' }
  ]

  const yearData: IncomeExpense = {
    income: [45, 46, 50, 45, 47],
    expense: [-25, -25, -30, -50, -30]
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
