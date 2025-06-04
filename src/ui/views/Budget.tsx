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

import { expenses, getExpensesByCategory } from '../data'


export default function Budget() {

  const expenseData = getExpensesByCategory(expenses)

  const expenseRows = expenses.map(exp => (
    <TableRow>
      <TableCell>{exp.desc}</TableCell>
      <TableCell>{exp.category}</TableCell>
      <TableCell>${exp.amount}</TableCell>
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
