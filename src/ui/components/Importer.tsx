import { useContext, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { GlobalContext } from '../contexts'

import '../styles/Importer.css'

export default function Importer() {

  const gCtx = useContext(GlobalContext)

  // dialog modal

  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  const handleChooseFile = async () => {
    const fileName = await window.electronAPI.selectImportFile()
    setFileName(fileName)
  }

  const handleClose = () => {
    setFileName(null)
    setLoading(false)
    setOpen(false)
  }

  const handleImport = async () => {
    setLoading(true)

    const res = await window.electronAPI.import()

    if (res.error) {
      console.error(res.message)
      gCtx.displayFeedback(true, res.message)
    } else {
      gCtx.displayFeedback(false, 'Import was successful')
    }

    handleClose()
  }

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
