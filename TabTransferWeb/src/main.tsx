import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home.tsx'
import Signin from './components/Signin.tsx'
import Group from './components/Group.tsx'
import Signup from './components/Signup.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'

const router = createBrowserRouter([
  {

    path: "/",
    element: <App/>,
    children: [
      { path: "/", element: <Signin /> },
      { path: "/signin", element: <Signin /> },
      { path: "/signup", element: <Signup />},
      { path: "/home", element:<ProtectedRoute><Home /></ProtectedRoute>  },
      {path: "/group/:id", element: <ProtectedRoute><Group /></ProtectedRoute> },
    ]

  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
