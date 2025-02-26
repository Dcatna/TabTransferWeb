
import { Outlet } from 'react-router-dom'
import AppSidebar from './components/Sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { useUserStore } from './data/userstore';
import { useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from './components/Theme';
function App() {
  const init = useUserStore((state) => state.init);
  
  useEffect(() => {
    const unsubscribe = init(); 
    return () => unsubscribe(); 
  }, [init])

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Analytics />
        <SidebarProvider className="max-h-screen overflow-hidden">

            <AppSidebar variant="sidebar" collapsible="icon" />
            <SidebarTrigger />
            <Outlet />
          

        </SidebarProvider>
      </ThemeProvider>
    </>
  )
}

export default App
