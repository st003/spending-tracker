import React, { useEffect, useMemo, useState } from 'react'

import log from 'electron-log/renderer'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormGroup from '@mui/material/FormGroup'
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

import CopyContainer from '../components/CopyContainer'
import PaymentCategoryPieChartProps from '../components/PaymentCategoryPieChartProps'

import {
  capitalize,
  formatDateYYYYMMDD,
  formatMonthLabel,
  formatSignedAmount,
  getLastMonth,
  getSumOfPaymentsByCategory,
  sortPaymentData
} from '../utils'

import '../styles/Payments.css'

import type { PaymentProperty, OrderByDirection, PaymentCategory } from '../types'

const LABELS: PaymentProperty[] = ['description', 'category', 'amount', 'date']

interface FilterDialogProps {
  open: boolean
  setOpen: (value: boolean) => void
  month: string
  monthInput: string
  setMonthInput: React.Dispatch<React.SetStateAction<string>>
  handleApply: (newMonthSelection: string) => void
}

function FilterDialog({ open, setOpen, month, monthInput, setMonthInput, handleApply }: FilterDialogProps) {

  const handleMonthSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonthInput(event.target.value)
  }

  const handleClose = () => {
    setMonthInput(month)
    setOpen(false)
  }

  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={open}
    >
      <DialogTitle>Filter Settings</DialogTitle>
      <DialogContent className='PaymentsFilterDialogBody'>
        <FormGroup>
          <label>Month</label>
          <div className='inputContainer'>
            <input
              type='month'
              value={monthInput}
              onChange={handleMonthSelectionChange}
            />
          </div>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleApply(monthInput)}>Apply</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

interface ExpensesProps {
  expenseData: PaymentCategory[]
}

function Expenses({ expenseData }: ExpensesProps): React.JSX.Element {
  return (
    <Card variant='outlined'>
      <CardHeader title='Expenses' />
      <CardContent>
        <PaymentCategoryPieChartProps data={expenseData} pos={false} />
      </CardContent>
    </Card>
  )
}

interface IncomeProps {
  incomeData: PaymentCategory[]
}

function Income({ incomeData }: IncomeProps): React.JSX.Element {
  return (
    <Card variant='outlined'>
      <CardHeader title='Income' />
      <CardContent>
        <PaymentCategoryPieChartProps data={incomeData} pos={true} />
      </CardContent>
    </Card>
  )
}

interface AmountCellProps {
  amount: number
}

function AmountCell({ amount }: AmountCellProps): React.JSX.Element {
  const color = (amount > 0) ? 'AmountCellPos' : 'AmountCellNeg'
  const value = formatSignedAmount(amount)
  return <span className={color}>{value}</span>
}

interface PaymentItemsTableProps {
  payments: Payment[]
}

function PaymentItemsTable({ payments }: PaymentItemsTableProps): React.JSX.Element {

  const [orderByProperty, setOrderByProperty] = useState<PaymentProperty>('date')
  const [orderByDirection, setOrderByDirection] = useState<OrderByDirection>('desc')
  const [pageNumber, setPageNumber] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const itemTableHeaderCells = LABELS.map(label => (
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

  function handleOrderBy(_: React.MouseEvent, label: PaymentProperty) {
    if (orderByProperty !== label) {
      setOrderByProperty(label)
      setOrderByDirection('desc')
    } else {
      const newOrderByDirection = (orderByDirection === 'desc') ? 'asc' : 'desc'
      setOrderByDirection(newOrderByDirection)
    }
  }

  function handleChangePage(_: React.MouseEvent | null, newPageNumber: number) {
    setPageNumber(newPageNumber)
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPageNumber(0)
  }

  // controls the data to be displayed in the table
  const visibleRows = useMemo(() => {
    return payments
      .slice() // make a copy to prevent in-place sorting
      .sort((a, b) => sortPaymentData(orderByProperty, orderByDirection, a, b))
      .slice(pageNumber * rowsPerPage, (pageNumber * rowsPerPage) + rowsPerPage)
  },
  [payments, pageNumber, rowsPerPage, orderByProperty, orderByDirection])

  const itemRows = visibleRows.map(exp => (
    <TableRow key={exp.id}>
      <TableCell>{exp.description}</TableCell>
      <TableCell>
        <CopyContainer value={exp.category} toolTipPlacement='left' />
      </TableCell>
      <TableCell>
        <AmountCell amount={exp.amount} />
      </TableCell>
      <TableCell>{formatDateYYYYMMDD(exp.date)}</TableCell>
    </TableRow>
  ))

  return (
    <Card variant='outlined'>
      <CardHeader title='Items' />
      <CardContent>
        <TableContainer sx={{ mb: '1rem' }}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                {itemTableHeaderCells}
              </TableRow>
            </TableHead>
            <TableBody>
              {itemRows}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component='div'
          className='PaymentsTablePagination'
          count={payments.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={pageNumber}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </CardContent>
    </Card>
  )
}

export default function Payments(): React.JSX.Element {

  const [month, setMonth] = useState(getLastMonth())
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentsMonthLabel, setPaymentsMonthLabel] = useState(formatMonthLabel(month))

  useEffect(() => {
    (async () => {
      try {
        const payments: Payment[] = await window.electronAPI.getPaymentsForMonth(month)
        setPayments(payments)
      } catch (error) {
        log.log(error)
        setPayments([])
      }
    })()
  }, [])

  // filter dialog

  const [showPaymentsFilterDialog, setShowPaymentsFilterDialog] = useState(false)
  const [monthInput, setMonthInput] = useState(month)

  const applyPaymentsFilters = async (newMonthSelection: string) => {
    try {
      const payments: Payment[] = await window.electronAPI.getPaymentsForMonth(newMonthSelection)
      setPayments(payments)
    } catch (error) {
      log.log(error)
      setPayments([])
    } finally {
      setMonth(newMonthSelection)
      setPaymentsMonthLabel(formatMonthLabel(newMonthSelection))
      setShowPaymentsFilterDialog(false)
    }
  }

  const changeMonth = async (n: number) => {
    const d = new Date(month)
    d.setUTCMonth(d.getUTCMonth() + n)
    const newMonth = d.toISOString().slice(0, 7)
    setMonthInput(newMonth)
    await applyPaymentsFilters(newMonth)
  }

  // charts

  const expenseData = useMemo(() => {
    const expenses = payments.filter(p => p.amount < 0)
    return getSumOfPaymentsByCategory(expenses)
  }, [payments])

  const incomeData = useMemo(() => {
    const income = payments.filter(p => p.amount > 0)
    return getSumOfPaymentsByCategory(income)
  }, [payments])

  return (
    <>
      <Grid className='PaymentsPageHeader' container>
        <Grid size={{ xs: 4 }}>
          <h1>Payments</h1>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <div className='PaymentsMonthSelectionLabel'>{paymentsMonthLabel}</div>
        </Grid>
        <Grid size={{ xs: 4 }} sx={{ textAlign: 'right' }}>
          <IconButton onClick={() => changeMonth(-1)} title='Back 1 Month'>
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton onClick={() => changeMonth(1)} title='Forward 1 Month'>
            <ArrowForwardIosIcon />
          </IconButton>
          <IconButton
            onClick={() => setShowPaymentsFilterDialog(true)}
            title='Open Filter Settings'
          >
            <MoreVertIcon />
          </IconButton>
        </Grid>
        <FilterDialog
          open={showPaymentsFilterDialog}
          setOpen={setShowPaymentsFilterDialog}
          month={month}
          monthInput={monthInput}
          setMonthInput={setMonthInput}
          handleApply={applyPaymentsFilters}
        />
      </Grid>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Expenses expenseData={expenseData} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Income incomeData={incomeData} />
        </Grid>
      </Grid>
      <PaymentItemsTable payments={payments} />
    </>
  )
}
