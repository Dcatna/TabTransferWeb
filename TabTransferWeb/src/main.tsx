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
import ForgotPassword from './components/ForgotPassword.tsx'
import ChangePasswordPage from './components/ChangePasswordPage.tsx'
import ErrorPage from './components/ErrorPage.tsx'
import { ThemeProvider } from './components/Theme.tsx'
import TabBundlerCreate from './components/TabBundlerCreate.tsx'
import ViewBundle from './components/ViewBundle.tsx'

const router = createBrowserRouter([
  {

    path: "/",
    element: <App/>,
    errorElement: <ThemeProvider><ErrorPage/></ThemeProvider>,
    children: [
      { path: "/", element: <Signin /> },
      { path: "/signin", element: <Signin /> },
      { path: "/signup", element: <Signup />},
      { path: "/home", element:<ProtectedRoute><Home /></ProtectedRoute>  },
      { path: "/group/:id", element: <ProtectedRoute><Group /></ProtectedRoute> },
      { path: "/forgotpassword", element: <ForgotPassword /> },
      { path: "/resetpassword", element: <ChangePasswordPage /> },
      { path: "/create_tab_bundle", element: <TabBundlerCreate /> },
      { path: "/view_bundle/:bundleId", element: <ViewBundle />}

    ]
  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
