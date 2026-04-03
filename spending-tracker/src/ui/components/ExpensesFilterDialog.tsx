import React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import '../styles/ExpensesFilterDialog.css'

interface ExpensesFilterDialogProps {
  monthSelection: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  monthInputValue: string;
  setMonthInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleApply: (newMonthSelection: string) => void;
}

export default function ExpensesFilterDialog({ monthSelection, open, setOpen, monthInputValue, setMonthInputValue, handleApply }: ExpensesFilterDialogProps) {

  const handleMonthSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonthInputValue(event.target.value)
  }

  const handleClose = () => {
    setMonthInputValue(monthSelection)
    setOpen(false)
  }

  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={open}
    >
      <DialogTitle>Filter Settings</DialogTitle>
      <DialogContent className='ExpensesFilterDialogBody'>
        <label>Month</label>
        <div className='inputContainer'>
          <input
            type='month'
            value={monthInputValue}
            onChange={handleMonthSelectionChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleApply(monthInputValue)}>Apply</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
