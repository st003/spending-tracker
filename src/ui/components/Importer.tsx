import { useEffect, useState } from 'react'

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

  const handleChooseFile = () => {
    // TODO: fix type safety
    // @ts-ignore
    window.electronAPI.selectImportFile()
  }

  const handleClose = () => {
    setFileName(null)
    setOpen(false)
  }

  // TODO: fix type safety
  // @ts-ignore
  window.electronAPI.openImporter((value: true) => setOpen(value))

  // subscribe to listen for file selection
  useEffect(() => {

    // TODO: fix type safety
    // @ts-ignore
    window.electronAPI.sendSelectedFile((fileName) => {
      setFileName(fileName)
    })

    // TODO: should we be destroying the event listener on
    // component unmount?
  }, [])

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
          <Button onClick={handleChooseFile}>Choose File</Button>
          <span className='SelectedFile'>{selectedFile}</span>
        </DialogContent>
        <DialogActions>
          <Button disabled={importBtnDisabled} onClick={handleClose}>Import</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
