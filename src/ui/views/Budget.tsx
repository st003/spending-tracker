import React, { useMemo, useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'

import Expense from '../components/Expense'

import { formatAmount, getTotalExpensesByCategory } from '../utils'

import { expenses } from '../data'


export default function Budget() {

  const [pageNumber, setPageNumber] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  function handleChangePage(event: React.MouseEvent<HTMLButtonElement> | null, newPageNumber: number) {
    setPageNumber(newPageNumber)
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPageNumber(0)
  };

  const expenseData = getTotalExpensesByCategory(expenses)

  const visibleRows = useMemo(() => {
    // controls the data to be displayed in the table
    return expenses.slice(pageNumber * rowsPerPage, (pageNumber * rowsPerPage) + rowsPerPage)
  },[pageNumber, rowsPerPage])

  const expenseRows = visibleRows.map(exp => (
    <TableRow key={exp.id}>
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
          <TableContainer sx={{ marginBottom: '1rem' }}>
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
          <TablePagination
            component='div'
            count={expenses.length}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            page={pageNumber}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </CardContent>
      </Card>
    </>
  )
}
