

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
      //const tabs = await GetMostRecentUserTabs(user.data.user?.id);

      const monthsTabs = await GetUserTabsWithinMonth(user.data.user?.id);

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

      //setRecentTabs(tabs || []);
      setGroupedTabs(grouped?.reverse());
    }

    GetRecentTab();
  }, [deleted]);

    
    function onDelete() {
      setDeleted((prev) => !prev)
    }

  return (
    <div className="flex flex-col w-full">
      {groupedTabs?.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 grid-flow-row-dense auto-rows-[minmax(100px, auto)]">
          {groupedTabs?.map((group, index) => (
            <div className="w-full" key={index}>
              <TabCard tabs={group} onDelete={onDelete} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-grow items-center justify-center w-full">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center">
            <p>No tabs found.</p>
            <p>Try saving browsers states with the extension TabTransfer</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home

