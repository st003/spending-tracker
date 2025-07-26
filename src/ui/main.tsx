import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import router from './router'

import './styles/global.css'

function Importer() {

  const [open, setOpen] = useState(false)

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
        {/* TODO: add importer file select */}
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Importer />
  </StrictMode>,
)
