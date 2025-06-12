import { createHashRouter } from 'react-router-dom'

import Budget from './views/Budget'
import Dashboard from './views/Dashboard'
import RootLayout from './components/RootLayout'

// use a HashRouter. BrowserRouter doesn't work in packaged app
const router = createHashRouter([
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
