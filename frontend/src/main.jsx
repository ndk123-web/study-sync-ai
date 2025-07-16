import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'

import { RouterProvider } from 'react-router-dom'
import AppRouter from './router/AppRouter.jsx'

localStorage.getItem('mode') === null && localStorage.setItem('mode', 'light')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={AppRouter} />
  </StrictMode>,
)
