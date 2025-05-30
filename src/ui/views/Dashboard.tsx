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
      <h2>Net Income (By Month)</h2>
      <div>
        <BarChart
          xAxis={[{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] }]}
          series={seriesMonth}
          height={300}
        />
      </div>
      <Grid container>
        <Grid size={{ sm: 12, lg: 6 }}>
          <h2>Expenses (Previous Month)</h2>
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
            width={300}
            height={300}
          />
        </Grid>
        <Grid size={{ sm: 12, lg: 6 }}>
          <h2>Net Income (By Year)</h2>
          <BarChart
            xAxis={[{ data: ['2021', '2022', '2023', '2024', '2025'] }]}
            series={seriesYear}
            height={300}
          />
        </Grid>
      </Grid>
    </div>
  )
}
