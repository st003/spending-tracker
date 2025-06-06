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

import { formatAmount, getTotalExpensesByCategory } from '../utils'

import { expenses } from '../data'


export default function Budget() {

  const expenseData = getTotalExpensesByCategory(expenses)

  const expenseRows = expenses.map(exp => (
    <TableRow>
      <TableCell>{exp.desc}</TableCell>
      <TableCell>{exp.category}</TableCell>
      <TableCell>{formatAmount(exp.amount)}</TableCell>
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
            <Table size='small'>
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
