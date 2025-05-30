import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'

import '../styles/dashboard.css'


export default function Dashboard() {

  const seriesMonth = [
    {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      label: 'Income',
      stack: 'diverging',
      color: 'green'
    },
    {
      data: [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12],
      label: 'Expense',
      stack: 'diverging',
      color: 'red'
    },
  ]

    const seriesYear = [
    {
      data: [1, 2, 3, 4, 5],
      label: 'Income',
      stack: 'diverging',
      color: 'green'
    },
    {
      data: [-1, -2, -3, -4, -5],
      label: 'Expense',
      stack: 'diverging',
      color: 'red'
    },
  ]

  return (
    <div className='dashboard'>
      <h1>Dashboard</h1>
      <Card variant='outlined' sx={{ mb: 2 }}>
        <CardHeader title='Net Income (By Month)' />
        <CardContent>
          <BarChart
            xAxis={[{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] }]}
            series={seriesMonth}
            height={280}
          />
        </CardContent>
      </Card>
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
                height={309} // TODO: make this the same height as bar chart
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ sm: 12, lg: 6 }}>
          <Card variant='outlined'>
            <CardHeader title='Net Income (By Year)' />
            <CardContent>
              <BarChart
                xAxis={[{ data: ['2021', '2022', '2023', '2024', '2025'] }]}
                series={seriesYear}
                height={280}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
