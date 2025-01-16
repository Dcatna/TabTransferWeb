import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home.tsx'
import Signin from './components/Signin.tsx'
import Grouped from './components/Grouped.tsx'

const router = createBrowserRouter([
  {

    path: "/",
    element: <App/>,
    children: [
      { path: "/", element: <Signin /> },
      { path: "/signin", element: <Signin /> },
      { path: "/home", element: <Home /> },
      {path: "/grouped", element: <Grouped /> },
    ]

  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
