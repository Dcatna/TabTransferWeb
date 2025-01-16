

import { useEffect, useState } from 'react'
import { GetMostRecentUserTabs, GetUserTabsWithinMonth, supabase } from '../data/supabaseclient'
import TabCard from './TabCard'
import { Tabs } from '../data/Types'


const Home = () => {

    const [recentTabs, setRecentTabs] = useState<Tabs[]>([])
    const [groupedTabs, setGroupedTabs] = useState<Tabs[][] | undefined>([]);

    const [expandedCards, setExpandedCards] = useState<boolean[]>([]);

const toggleCard = (index: number) => {
  setExpandedCards((prev) => {
    const newState = [...prev];
    newState[index] = !newState[index];
    return newState;
  });
};
  useEffect(() => {
    async function GetRecentTab() {
      const user = await supabase.auth.getUser();

      const tabs = await GetMostRecentUserTabs(user.data.user?.id);
      const monthsTabs = await GetUserTabsWithinMonth(user.data.user?.id);

      console.log(monthsTabs, 'MONTHS');

      const grouped = monthsTabs?.reduce<Tabs[][]>((acc, tab) => {
        const date = new Date(tab.created_at).toISOString().split('T')[0];

        const lastGroup = acc[acc.length - 1];
        if (!lastGroup || new Date(lastGroup[0].created_at).toISOString().split('T')[0] !== date) {
          acc.push([tab]);
        } else {
          lastGroup.push(tab);
        }

        return acc;
      }, []);

      console.log(grouped, 'Grouped Tabs');
      setRecentTabs(tabs || []);
      setGroupedTabs(grouped?.reverse());
    }

    GetRecentTab();
  }, []);

    console.log(recentTabs)

  return (
    <div className="">

      <div className="grid grid-cols-6 gap-4 p-4 items-start">
        {groupedTabs?.map((group, index) => (
           <TabCard
           tabs={group}
           key={index}
           isExpanded={expandedCards[index] || false} 
           toggleDropdown={() => toggleCard(index)}
         />
        ))}
      </div>
    </div>

  )
}

export default Home

