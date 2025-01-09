

import { useEffect, useState } from 'react'
import { GetUserTabs, SignOut, supabase } from '../data/supabaseclient'
import { useNavigate } from 'react-router-dom'


const Home = () => {
    const navigate = useNavigate()
    const [recentTabs, setRecentTabs] = useState<{url : string}[]>([])
    
    useEffect(() => {
        async function GetRecentTab() {
            const user = await supabase.auth.getUser()

            const tabs = await GetUserTabs(user.data.user?.id)
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
    <div>
        <button onClick={HandleClick}>Signout</button>
        Home
    </div>
  )
}

export default Home

