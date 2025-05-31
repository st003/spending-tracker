import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

import { PieChart } from '@mui/x-charts/PieChart'

import NetIncome from '../components/NetIncome'

import '../styles/dashboard.css'

import type { IncomeExpense } from '../types'


export default function Dashboard() {

  const dataMonth: IncomeExpense = {
    income: [45, 46, 50, 45, 47, 48, 45, 45, 49, 46, 45, 50],
    expense: [-25, -25, -30, -50, -30, -25, -20, -25, -27, -29, -33, -45]
  }

  const dataYear: IncomeExpense = {
    income: [45, 46, 50, 45, 47],
    expense: [-25, -25, -30, -50, -30]
  }

  return (
    <div className='dashboard'>
      <h1>Dashboard</h1>
      <NetIncome scale='Month' data={dataMonth} />
      <Grid container spacing={2}>
        <Grid size={{ sm: 12, lg: 6 }}>
          <Card variant='outlined'>
            <CardHeader title='Expenses (Previous Month)' />
            <CardContent>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: 'Category 1' },
                      { id: 1, value: 15, label: 'Category 2' },
                      { id: 2, value: 20, label: 'Category 3' },
                    ],
                  },
                ]}
                height={300} // TODO: make this the same height as bar chart
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ sm: 12, lg: 6 }}>
          <NetIncome scale='Year' data={dataYear} />
        </Grid>
      </Grid>
    </div>
  )
}
