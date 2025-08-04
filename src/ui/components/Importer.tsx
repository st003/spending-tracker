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

  const [file, setFile] = useState<File|null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
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
              onChange={handleFileChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button disabled={!file}>Import</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
