

import { useEffect, useState } from 'react'
import {  GetUserTabsWithinMonth, supabase } from '../data/supabaseclient'
import TabCard from './TabCard'
import { Tabs } from '../data/Types'


const Home = () => {

    //const [recentTabs, setRecentTabs] = useState<Tabs[]>([])
    const [groupedTabs, setGroupedTabs] = useState<Tabs[][] | undefined>([]);
    const [deleted, setDeleted] = useState<boolean>(false)

  useEffect(() => {
    async function GetRecentTab() {
      const user = await supabase.auth.getUser();
      console.log(user, "HELo")
      //const tabs = await GetMostRecentUserTabs(user.data.user?.id);

      const monthsTabs = await GetUserTabsWithinMonth(user.data.user?.id);

      console.log(monthsTabs, 'MONTHS');

      const grouped = (() => {
      const map = new Map<string, Tabs[]>(); // Map to store grouped data

      monthsTabs?.forEach(tab => {
        

        if (!map.has(tab.created_at)) {
          map.set(tab.created_at, []);
        }
        map.get(tab.created_at)!.push(tab);
      });

      return Array.from(map.values()); // Convert Map values to array of arrays
    })()

      console.log(grouped, 'Grouped Tabs');
      //setRecentTabs(tabs || []);
      setGroupedTabs(grouped?.reverse());
    }

    GetRecentTab();
  }, [deleted]);

    
    function onDelete() {
      setDeleted((prev) => !prev)
    }
  return (
    <div className="">

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 grid-flow-row-dense auto-rows-[minmax(100px, auto)]">
        {groupedTabs?.map((group, index) => (
          <div className='w-full'>
            <TabCard
              tabs={group}
              key={index} 
              onDelete={onDelete}
            />
         </div>
        ))}
      </div>
    </div>

  )
}

export default Home

