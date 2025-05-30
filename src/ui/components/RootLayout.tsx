import { Outlet, useNavigate } from 'react-router-dom'

import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

import BarChartIcon from '@mui/icons-material/BarChart'
import PieChartIcon from '@mui/icons-material/PieChart'


export default function RootLayout() {

  const navigate = useNavigate()

  return (
    <div className='rootLayout'>
      <main>
        <Outlet />
      </main>
      <footer>
        <BottomNavigation showLabels sx={{ backgroundColor: '#f6f7f8'}}>
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
  )
}
