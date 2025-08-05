import { useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

export default function Importer() {

  // dialog modal

  const [open, setOpen] = useState(false)

  const handleChooseFile = () => {
    // TODO: fix type safety
    // @ts-ignore
    window.electronAPI.selectImportFile()
  }

  const handleClose = () => {
    setOpen(false)
  }

  // TODO: fix type safety
  // @ts-ignore
  window.electronAPI.openImporter((value: true) => setOpen(value))

  return (
    <>
      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
      >
        <DialogTitle>Import Data</DialogTitle>
        <DialogContent>
          <p>Select CSV file for import. File must be formatted to importer requirements.</p>
          <Button onClick={handleChooseFile}>Choose File</Button>
        </DialogContent>
        <DialogActions>
          <Button disabled={true}>Import</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
