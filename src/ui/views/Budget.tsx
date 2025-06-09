import React, { useEffect, useMemo, useState } from 'react'

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
import TableSortLabel from '@mui/material/TableSortLabel'

import Expense from '../components/Expense'

import {
  capitalize,
  formatDate,
  formatAmount,
  getTotalExpensesByCategory,
  sortExpenseData
} from '../utils'

import type { Expense as ExpenseType, ExpenseProperty, OrderByDirection } from '../types'


const LABELS: ExpenseProperty[] = ['description', 'category', 'amount', 'date']

export default function Budget() {

  const [expenses, setExpenses] = useState<ExpenseType[]>([])
  const [orderByProperty, setOrderByProperty] = useState<ExpenseProperty>('date')
  const [orderByDirection, setOrderByDirection] = useState<OrderByDirection>('desc')

  // get data from backend

  useEffect(() => {
    (async () => {
      try {
        // @ts-ignore
        const result = await window.electronAPI.getExpenses()
        setExpenses(result)
      } catch (error) {
        // TODO: improve error handling
        console.error(error)
      }
    })()
  }, [])

  // expense headers

  function handleOrderBy(event: React.MouseEvent, label: ExpenseProperty) {
    if (orderByProperty !== label) {
      setOrderByProperty(label)
      setOrderByDirection('desc')
    } else {
      const newOrderByDirection = (orderByDirection === 'desc') ? 'asc' : 'desc'
      setOrderByDirection(newOrderByDirection)
    }
  }

  const expenseHeaderCells = LABELS.map(label => (
    <TableCell
      key={label}
      sortDirection={orderByDirection}
    >
      <TableSortLabel
        active={orderByProperty === label}
        direction={orderByDirection}
        onClick={event => handleOrderBy(event, label)}
      >
        {capitalize(label)}
      </TableSortLabel>
    </TableCell>
  ))

  // expense rows

  const [pageNumber, setPageNumber] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  function handleChangePage(event: React.MouseEvent | null, newPageNumber: number) {
    setPageNumber(newPageNumber)
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPageNumber(0)
  };

  const expenseData = useMemo(() => getTotalExpensesByCategory(expenses), [expenses])

  // controls the data to be displayed in the table
  const visibleRows = useMemo(() => {
    return expenses
      .slice() // make a copy to prevent in-place sorting
      .sort((a, b) => sortExpenseData(orderByProperty, orderByDirection, a, b))
      .slice(pageNumber * rowsPerPage, (pageNumber * rowsPerPage) + rowsPerPage)
  },
  [expenses, pageNumber, rowsPerPage, orderByProperty, orderByDirection])

  const expenseRows = visibleRows.map(exp => (
    <TableRow key={exp.id}>
      <TableCell>{exp.description}</TableCell>
      <TableCell>{exp.category}</TableCell>
      <TableCell>{formatAmount(exp.amount)}</TableCell>
      <TableCell>{formatDate(exp.date)}</TableCell>
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
                  {expenseHeaderCells}
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
