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
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'

import CopyContainer from '../components/CopyContainer'
import Expense from '../components/Expense'

import {
  capitalize,
  formatDateYYYYMMDD,
  formatMonthLabel,
  formatAmount,
  getLastMonth,
  getTotalExpensesByCategory,
  sortExpenseData
} from '../utils'

import '../styles/Payments.css'

import type { PaymentProperty, OrderByDirection } from '../types'

const LABELS: PaymentProperty[] = ['description', 'category', 'amount', 'date']

interface FilterDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  month: string;
  monthInput: string;
  setMonthInput: React.Dispatch<React.SetStateAction<string>>;
  showIncome: boolean;
  showIncomeToggle: boolean;
  setShowIncomeToggle: React.Dispatch<React.SetStateAction<boolean>>;
  handleApply: (newMonthSelection: string, newShowIncomeValue: boolean) => void;
}

function FilterDialog({ open, setOpen, month, monthInput, setMonthInput, showIncome, showIncomeToggle, setShowIncomeToggle, handleApply }: FilterDialogProps) {

  const handleMonthSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonthInput(event.target.value)
  }

  const handleClose = () => {
    setMonthInput(month)
    setShowIncomeToggle(showIncome)
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
          <FormControlLabel
            label='Show Income'
            control={
              <Switch
                checked={showIncomeToggle}
                onChange={() => setShowIncomeToggle(!showIncomeToggle)}
              />
            }
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleApply(monthInput, showIncomeToggle)}>Apply</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

interface AmountCellProps {
  amount: number;
  signed: boolean;
}

function AmountCell({ amount, signed }: AmountCellProps): React.JSX.Element {

  let color = ''
  if (signed) color = (amount > 0) ? 'AmountCellPos' : 'AmountCellNeg'

  const value = formatAmount(amount, signed)

  return (
    <span className={color}>{value}</span>
  )
}

export default function Payments(): React.JSX.Element {

  const [month, setMonth] = useState(getLastMonth())
  const [showIncome, setShowIncome] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])

  const [paymentsMonthLabel, setPaymentsMonthLabel] = useState(formatMonthLabel(month))
  const [showPaymentsFilterSettings, setShowPaymentsFilterSettings] = useState(false)

  const [monthInput, setMonthInput] = useState(month)
  const [showIncomeToggle, setShowIncomeToggle] = useState(showIncome)

  const [orderByProperty, setOrderByProperty] = useState<PaymentProperty>('date')
  const [orderByDirection, setOrderByDirection] = useState<OrderByDirection>('desc')

  const applyPaymentsFilters = async (newMonthSelection: string, newShowIncomeValue: boolean) => {
    try {
      const payments: Payment[] = await window.electronAPI.getExpensesForMonth(newMonthSelection)
      setPayments(payments)
    } catch (error) {
      log.log(error)
      setPayments([])
    } finally {
      setMonth(newMonthSelection)
      setShowIncome(newShowIncomeValue)
      setPaymentsMonthLabel(formatMonthLabel(newMonthSelection))
      setShowPaymentsFilterSettings(false)
    }
  }

  const changeMonth = async (n: number) => {
    const d = new Date(month)
    d.setUTCMonth(d.getUTCMonth() + n)
    const newMonth = d.toISOString().slice(0, 7)
    setMonthInput(newMonth)
    await applyPaymentsFilters(newMonth, showIncomeToggle)
  }

  // get initial data
  useEffect(() => {
    (async () => {
      try {
        const payments: Payment[] = await window.electronAPI.getExpensesForMonth(month)
        setPayments(payments)
      } catch (error) {
        log.log(error)
        setPayments([])
      }
    })()
  }, [])

  // item table headers

  function handleOrderBy(_: React.MouseEvent, label: PaymentProperty) {
    if (orderByProperty !== label) {
      setOrderByProperty(label)
      setOrderByDirection('desc')
    } else {
      const newOrderByDirection = (orderByDirection === 'desc') ? 'asc' : 'desc'
      setOrderByDirection(newOrderByDirection)
    }
  }

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

  // item table rows

  const [pageNumber, setPageNumber] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  function handleChangePage(_: React.MouseEvent | null, newPageNumber: number) {
    setPageNumber(newPageNumber)
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPageNumber(0)
  };

  // TODO: update to return income
  const paymentData = useMemo(() => getTotalExpensesByCategory(payments), [payments])

  // controls the data to be displayed in the table
  const visibleRows = useMemo(() => {
    return payments
      .slice() // make a copy to prevent in-place sorting
      .sort((a, b) => sortExpenseData(orderByProperty, orderByDirection, a, b))
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
        <AmountCell amount={exp.amount} signed={showIncome} />
      </TableCell>
      <TableCell>{formatDateYYYYMMDD(exp.date)}</TableCell>
    </TableRow>
  ))

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
            onClick={() => setShowPaymentsFilterSettings(true)}
            title='Open Filter Settings'
          >
            <MoreVertIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Card variant='outlined' sx={{ mb: 2 }}>
        <CardHeader title='Categories' />
        <CardContent>
          <Expense data={paymentData} />
        </CardContent>
        <FilterDialog
          open={showPaymentsFilterSettings}
          setOpen={setShowPaymentsFilterSettings}
          month={month}
          monthInput={monthInput}
          setMonthInput={setMonthInput}
          showIncome={showIncome}
          showIncomeToggle={showIncomeToggle}
          setShowIncomeToggle={setShowIncomeToggle}
          handleApply={applyPaymentsFilters}
        />
      </Card>
      <Card variant='outlined'>
        <CardHeader title='Items' />
        <CardContent>
          <TableContainer sx={{ marginBottom: '1rem' }}>
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
    </>
  )
}
