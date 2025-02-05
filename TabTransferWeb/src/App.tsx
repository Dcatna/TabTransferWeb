
import { Outlet } from 'react-router-dom'
import AppSidebar from './components/Sidebar'
import { SidebarProvider } from './components/ui/sidebar'
import { useUserStore } from './data/userstore';
import { useEffect } from 'react';

function App() {
  const init = useUserStore((state) => state.init);

  useEffect(() => {
    const unsubscribe = init(); 
    return () => unsubscribe(); 
  }, [init])

  return (
    <SidebarProvider className="max-h-screen overflow-hidden">
      <AppSidebar variant="inset" collapsible="icon" />

      <Outlet />
    

    </SidebarProvider>
  )
}

export default App
