import { Outlet, useNavigate } from 'react-router-dom'

import { BottomNavigation, BottomNavigationAction } from '@mui/material'

import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';

import '../styles/root-layout.css'

export default function RootLayout() {

  const navigate = useNavigate()

  return (
    <div className='rootLayout'>
      <main>
        <Outlet />
      </main>
      <footer>
        <BottomNavigation showLabels>
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
