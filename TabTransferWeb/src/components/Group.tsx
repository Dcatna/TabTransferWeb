import { GetListItemsByName, supabase } from "@/data/supabaseclient";
import { GroupResponse } from "@/data/Types";
import { useUserStore } from "@/data/userstore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Group = () => {
  const location = useLocation();
  const list = location.state
  const user = useUserStore((state) => state.userData?.user)

  const [listData, setListData] = useState<GroupResponse[]>([])

  useEffect(() => {
    async function getListData() {
      const data = await GetListItemsByName(list.group_name, user!.id)
    }
  }, [list])
  console.log(list);
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header Section */}
      <div className="bg-white p-4 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold">{list.group_name}</h1>
        <p className="text-gray-600 mt-2">{list.description}</p>
      </div>

      {/* Tabs Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Tabs</h2>
        {list.tabs && list.tabs.length > 0 ? (
          <ul className="space-y-4">
            {list.tabs.map((tab, index) => (
              <li
                key={index}
                className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center"
              >
                <span>{tab.name}</span>
                <button className="text-red-500 hover:underline">
                  Remove Tab
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tabs yet. Start by adding one!</p>
        )}
      </div>

      {/* Add New Tab Button */}
      <div className="mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          + Add New Tab
        </button>
      </div>
    </div>
  )
}

export default Group