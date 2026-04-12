import { createHashRouter } from 'react-router-dom'

import Dashboard from './views/Dashboard'
import Documentation from './views/Documentation'
import Payments from './views/Payments'
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
        path: '/payments',
        element: <Payments />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/documentation',
        element: <Documentation />
      }
    ]
  }
], { basename: '/'})

export default router
