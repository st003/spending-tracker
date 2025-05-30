import { createBrowserRouter } from 'react-router-dom'

import Dashboard from './views/Dashboard'
import Budget from './views/Budget'
import RootLayout from './components/RootLayout'


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/budget',
        element: <Budget />
      }
    ]
  }
], { basename: '/'})

export default router
