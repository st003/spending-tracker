import { useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import '../styles/Importer.css'

export default function Importer() {

  // dialog modal

  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  const handleChooseFile = async () => {
    // TODO: fix type safety
    // @ts-ignore
    const fileName = await window.electronAPI.selectImportFile()
    setFileName(fileName)
  }

  const handleClose = () => {
    setFileName(null)
    setLoading(false)
    setOpen(false)
  }

  const handleImport = () => {
    setLoading(true)

    // TODO: temp to test import button behavior
    setTimeout(() => {
      handleClose()
    }, 5000)
  }

  // TODO: fix type safety
  // @ts-ignore
  window.electronAPI.openImporter((value: true) => setOpen(value))

  const selectedFile = (fileName) ? fileName : 'No file selected'
  const importBtnDisabled = fileName === null

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
          <Button onClick={handleChooseFile} disabled={loading}>Choose File</Button>
          <span className='SelectedFile'>{selectedFile}</span>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImport} disabled={importBtnDisabled} loading={loading}>Import</Button>
          <Button onClick={handleClose} disabled={loading}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
