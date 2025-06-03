import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import Expense from '../components/Expense'

import type { Expense as ExpenseType } from '../types'


export default function Budget() {

  const expenseData = [
    { value: 100, label: 'Category 1' },
    { value: 150, label: 'Category 2' },
    { value: 200, label: 'Category 3' }
  ]

  const expenses: ExpenseType[] = [
    {
      desc: 'Electric Bill',
      category: 'Utilities',
      amount: '$70.00',
      date: '2025-05-27'
    },
    {
      desc: 'Internet Bill',
      category: 'Utilities',
      amount: '$90.00',
      date: '2025-05-23'
    },
    {
      desc: 'Movie Tickets',
      category: 'Entertainment',
      amount: '$14.99',
      date: '2025-05-14'
    },
    {
      desc: 'Amazon Purchase',
      category: 'Shopping',
      amount: '$30.54',
      date: '2025-05-05'
    },
    {
      desc: 'Safeway',
      category: 'Groceries',
      amount: '$49.89',
      date: '2025-05-02'
    }
  ]

  const expenseRows = expenses.map(exp => (
    <TableRow>
      <TableCell>{exp.desc}</TableCell>
      <TableCell>{exp.category}</TableCell>
      <TableCell>{exp.amount}</TableCell>
      <TableCell>{exp.date}</TableCell>
    </TableRow>
  ))

  return (
    <>
      <h1>Budget</h1>
      <Card variant='outlined' sx={{ mb: 2 }}>
        <CardHeader title='Categories' />
        <CardContent>
          <Expense data={expenseData} />
        </CardContent>
      </Card>
      <Card variant='outlined'>
        <CardHeader title='Expenses' />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenseRows}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  )
}
