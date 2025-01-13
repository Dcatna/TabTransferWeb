

import { useEffect, useState } from 'react'
import { GetMostRecentUserTabs, GetUserTabsWithinMonth, SignOut, supabase } from '../data/supabaseclient'
import { useNavigate } from 'react-router-dom'
import TabCard from './TabCard'
import { Tabs } from '../data/Types'


const Home = () => {
    const navigate = useNavigate()
    const [recentTabs, setRecentTabs] = useState<Tabs[]>([])
    const [groupedTabs, setGroupedTabs] = useState<Tabs[][] | undefined>([]);

    const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
    
    const toggleCard = (index: number) => {
      console.log("Toggling card at index:", index);
        setExpandedCardIndex((prevIndex) => (prevIndex === index ? null : index));
    }

  useEffect(() => {
    async function GetRecentTab() {
      const user = await supabase.auth.getUser();

      // Fetch tabs
      const tabs = await GetMostRecentUserTabs(user.data.user?.id);
      const monthsTabs = await GetUserTabsWithinMonth(user.data.user?.id);

      console.log(monthsTabs, 'MONTHS');

      // Group tabs into arrays for each day
      const grouped = monthsTabs?.reduce<Tabs[][]>((acc, tab) => {
        const date = new Date(tab.created_at).toISOString().split('T')[0]; // Extract the date (YYYY-MM-DD)

        // Find the existing group for this date
        const lastGroup = acc[acc.length - 1];
        if (!lastGroup || new Date(lastGroup[0].created_at).toISOString().split('T')[0] !== date) {
          // If no group exists for this date, create a new one
          acc.push([tab]);
        } else {
          // Add the tab to the last group
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
    function HandleClick() {
        navigate("/signin")
        SignOut()
    }
  return (
    <div className="">
      <button onClick={HandleClick}>Signout</button>
      Home
      <div className="grid grid-cols-6 gap-4 p-4 items-start">
        {groupedTabs?.map((group, index) => (
          <TabCard
            tabs={group}
            key={index}
            isExpanded={expandedCardIndex === index}
            toggleDropdown={() => toggleCard(index)}
          />
        ))}
      </div>
    </div>

  )
}

export default Home

