import { useState } from 'react'

import Alert from '@mui/material/Alert';
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
  const [error, setError] = useState(false)
  const [finished, setFinished] = useState(false)
  const [message, setMessage] = useState('')

  const handleChooseFile = async () => {
    const fileName = await window.electronAPI.selectImportFile()
    setFileName(fileName)
  }

  const handleClose = () => {
    setFileName(null)
    setLoading(false)
    setError(false)
    setFinished(false)
    setMessage('')
    setOpen(false)

    // this works because it will execute before React
    // changes the state
    if (finished) window.location.reload()
  }

  const handleImport = async () => {
    setLoading(true)

    const res = await window.electronAPI.import()

    if (res.error) {
      setError(true)
      setMessage(res.message)
    } else {
      setFinished(true)
      setMessage('Import was successful')
    }
  }

  window.electronAPI.openImporter((value: true) => setOpen(value))

  const displayFileSelection = (!error && !finished)
  const selectedFile = (fileName) ? fileName : 'No file selected'
  const importBtnDisabled = (fileName === null) || error || finished
  const importBtnLoading = loading && !(error || finished)

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
          {displayFileSelection && (
            <>
              <Button onClick={handleChooseFile} disabled={loading}>Choose File</Button>
              <span className='SelectedFile'>{selectedFile}</span>
            </>
          )}
          {error && (<Alert severity='error'>{message}</Alert>)}
          {finished && (<Alert severity='success'>{message}</Alert>)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImport} disabled={importBtnDisabled} loading={importBtnLoading}>Import</Button>
          <Button onClick={handleClose} disabled={importBtnLoading}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
