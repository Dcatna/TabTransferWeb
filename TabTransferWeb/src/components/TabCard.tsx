import { useState } from "react";
import { Tabs } from "../data/Types"
interface TabCardProps {
  tabs : Tabs[]
}
const TabCard = ({ tabs }: TabCardProps) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const restoreTabs = () => {
    tabs.forEach((tab) => {
      window.open(tab.url, "_blank")
    })
  }

  const toggleDropdown = () => {
    setIsExpanded(!isExpanded);
  };
  
  
  
  return (
    <div className="border-black border p-4 rounded-md shadow-md w-full max-w-md mx-auto">
      <div
        className="cursor-pointer flex justify-between items-center bg-gray-100 p-3 rounded-md"
        onClick={toggleDropdown}
      >
        <h2 className="text-lg font-medium">Tabs Group</h2>
        <button onClick={restoreTabs}>Restore All</button>
        <span>{isExpanded ? "▲" : "▼"}</span>
      </div>

      {isExpanded && (
        <div className="bg-white mt-2 rounded-md shadow-inner p-3">
          <ul className="space-y-2">
            {tabs.map((tab, index) => (
              <li
                key={index}
                className="border-b pb-2 flex items-center space-x-2 "
              >
                <img src={tab.favicon_url} className="w-6 h-6" alt="" />
                <a
                  href={tab.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {tab.title || tab.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default TabCard