import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Index from './index.jsx'
import HomePage from './components/homepage.jsx'
import Foreground from './components/Foreground/foreground.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    children: [
      { index: true, element: < HomePage /> },
      { path: "component/homepage", element: < HomePage />},
      { path: "Foreground", element: < Foreground /> },
    ],  
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
