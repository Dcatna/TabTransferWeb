
import { Outlet } from 'react-router-dom'
import AppSidebar from './components/Sidebar'
import { SidebarProvider } from './components/ui/sidebar'

function App() {


  return (
    <SidebarProvider className="max-h-screen overflow-hidden">
      <AppSidebar variant="inset" collapsible="icon" />


      <Outlet />
    

    </SidebarProvider>
  )
}

export default App
