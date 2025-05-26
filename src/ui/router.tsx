import { createBrowserRouter } from 'react-router-dom'

import Dashboard from './views/Dashboard'
import Budget from './views/Budget'

const router = createBrowserRouter([
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
], { basename: '/'})

export default router
