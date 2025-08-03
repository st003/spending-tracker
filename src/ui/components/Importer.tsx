import { useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

export default function Importer() {

  // dialog modal

  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  // TODO: fix type safety
  // @ts-ignore
  window.electronAPI.openImporter((value: true) => setOpen(value))

  // file select

  const [fileInput, setFileInput] = useState('')

  const importBtnDisabled = fileInput === ''

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files) // debug
    // const file = event.target.files[0] || ''
    // setFileInput(file)
  }

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
          <div>
            <input
              type='file'
              accept='.csv'
              value={fileInput}
              onChange={handleFileChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button disabled={importBtnDisabled}>Import</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
