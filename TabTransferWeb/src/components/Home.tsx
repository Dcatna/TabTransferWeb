

import { useEffect, useState } from 'react'
import { GetMostRecentUserTabs, SignOut, supabase } from '../data/supabaseclient'
import { useNavigate } from 'react-router-dom'
import TabCard from './TabCard'
import { Tabs } from '../data/Types'


const Home = () => {
    const navigate = useNavigate()
    const [recentTabs, setRecentTabs] = useState<Tabs[]>([])
    
    useEffect(() => {
        async function GetRecentTab() {
            const user = await supabase.auth.getUser()

            const tabs = await GetMostRecentUserTabs(user.data.user?.id)
            setRecentTabs(tabs || [])
        }
        GetRecentTab()
        
        
    }, [])

    console.log(recentTabs)
    function HandleClick() {
        navigate("/Signin")
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

