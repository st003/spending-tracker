import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

import BarChartIcon from '@mui/icons-material/BarChart'
import PieChartIcon from '@mui/icons-material/PieChart'

import Feedback from './Feedback'
import Importer from './Importer'
import { GlobalContext } from '../contexts'

export default function RootLayout() {

  const navigate = useNavigate()

  const [openFeedback, setOpenFeedback] = useState(false)
  const [isFeedbackError, setIsFeedbackError] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const handleFeedbackOpen = (error: boolean, message: string) => {
    setOpenFeedback(true)
    setIsFeedbackError(error)
    setFeedbackMessage(message)
  }

  const handleFeedbackClose = () => {
    setOpenFeedback(false)
    setIsFeedbackError(false)
    setFeedbackMessage('')
  }

  const globalContextValue = {
    displayFeedback: handleFeedbackOpen
  }

  window.electronAPI.openDocumentation(() => navigate('/documentation'))

  return (
    <GlobalContext.Provider value={globalContextValue}>
      <div className='rootLayout'>
        <main>
          <Outlet />
        </main>
        <footer>
          <BottomNavigation showLabels sx={{ backgroundColor: '#f6f7f8' }}>
            <BottomNavigationAction
              label='Dashboard'
              icon={<BarChartIcon />}
              onClick={() => navigate('/dashboard')} />
            <BottomNavigationAction
              label='Budget'
              icon={<PieChartIcon />}
              onClick={() => navigate('/budget')} />
          </BottomNavigation>
        </footer>
      </div>
      <Importer />
      <Feedback
        open={openFeedback}
        handleClose={handleFeedbackClose}
        error={isFeedbackError}
        message={feedbackMessage}
      />
    </GlobalContext.Provider>
  )
}
