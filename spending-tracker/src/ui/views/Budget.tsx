import React, { useEffect, useMemo, useState } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'

import BudgetFilterDialog from '../components/BudgetFIlterDialog'
import Expense from '../components/Expense'

import {
  capitalize,
  formatDateYYYYMMDD,
  formatMonthLabel,
  formatAmount,
  getTotalExpensesByCategory,
  sortExpenseData
} from '../utils'

import '../styles/Budget.css'

import type { ExpenseProperty, OrderByDirection } from '../types'

const LABELS: ExpenseProperty[] = ['description', 'category', 'amount', 'date']

export default function Budget(): React.JSX.Element {

  const today = new Date()
  today.setUTCMonth(today.getUTCMonth() - 1)

  const [monthSelection, setMonthSelection] = useState(today.toISOString().slice(0, 7))
  const [expenseMonthLabel, setExpenseMonthLabel] = useState(formatMonthLabel(today))
  const [showExpenseFilterSettings, setShowExpenseFilterSettings] = useState(false)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [orderByProperty, setOrderByProperty] = useState<ExpenseProperty>('date')
  const [orderByDirection, setOrderByDirection] = useState<OrderByDirection>('desc')

  const applyExpenseFilters = async (newMonthSelection: string) => {
    try {
      const expenses: Expense[] = await window.electronAPI.getExpensesForMonth(newMonthSelection)
      setExpenses(expenses)
    } catch (error) {
      console.log(error)
      setExpenses([])
    } finally {
      setMonthSelection(newMonthSelection)
      setExpenseMonthLabel(formatMonthLabel(new Date(newMonthSelection)))
      setShowExpenseFilterSettings(false)
    }
  }

  // get initial data
  useEffect(() => {
    (async () => {
      try {
        const expenses: Expense[] = await window.electronAPI.getExpensesForMonth(monthSelection)
        setExpenses(expenses)
      } catch (error) {
        console.log(error)
        setExpenses([])
      }
    })()
  }, [])

  // expense headers

  function handleOrderBy(_: React.MouseEvent, label: ExpenseProperty) {
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

  function handleChangePage(_: React.MouseEvent | null, newPageNumber: number) {
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
      <TableCell>{formatDateYYYYMMDD(exp.date)}</TableCell>
    </TableRow>
  ))

  return (
    <>
      <Grid container>
        <Grid size={{ xs: 6 }}>
          <h1>Budget</h1>
        </Grid>
        <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
          <span className='BudgetMonthSelectionLabel'>{expenseMonthLabel}</span>
          <IconButton
            sx={{ marginLeft: '0.5rem' }}
            onClick={() => setShowExpenseFilterSettings(true)}
            title='Open Filter Settings'
          >
            <MoreVertIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Card variant='outlined' sx={{ mb: 2 }}>
        <CardHeader title='Categories' />
        <CardContent>
          <Expense data={expenseData} />
        </CardContent>
        <BudgetFilterDialog
          open={showExpenseFilterSettings}
          setOpen={setShowExpenseFilterSettings}
          monthSelection={monthSelection}
          handleApply={applyExpenseFilters}
        />
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
            className='ExpenseTablePagination'
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
