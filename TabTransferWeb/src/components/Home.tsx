

import { useEffect, useState } from 'react'
import { GetMostRecentUserTabs, GetUserTabsWithinMonth, SignOut, supabase } from '../data/supabaseclient'
import { useNavigate } from 'react-router-dom'
import TabCard from './TabCard'
import { Tabs } from '../data/Types'


const Home = () => {
    const navigate = useNavigate()
    const [recentTabs, setRecentTabs] = useState<Tabs[]>([])
    const [monthsTabs, setMonthsTabs] = useState<Record<string, Tabs[]>>({})


    useEffect(() => {
        async function GetRecentTab() {
            const user = await supabase.auth.getUser()

            const tabs = await GetMostRecentUserTabs(user.data.user?.id)
            const monthsTabs = await GetUserTabsWithinMonth(user.data.user?.id)
            const grouped = monthsTabs?.reduce((acc: Record<string, Tabs[]>, tab: Tabs) => {
                const date = new Date(tab.created_at).toISOString().split('T')[0]; // Extract the date (YYYY-MM-DD)
                if (!acc[date]) {
                  acc[date] = [];
                }
                acc[date].push(tab);
                return acc;
              }, {});
            console.log(grouped)
            console.log(monthsTabs, "MOTHS")
            setRecentTabs(tabs || [])
        }
        GetRecentTab()
        
        
    }, [])

    console.log(recentTabs)
    function HandleClick() {
        navigate("/signin")
        SignOut()
    }
  return (
    <div className=''>
        <button onClick={HandleClick}>Signout</button>
        Home
        <div>
            {<TabCard tabs={recentTabs}/>}
        </div>
    </div>
  )
}

export default Home

