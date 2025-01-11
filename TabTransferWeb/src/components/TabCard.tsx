import { useState } from "react";
import { Tabs } from "../data/Types"
interface TabCardProps {
  tabs : Tabs[]
}
const TabCard = ({ tabs }: TabCardProps) => {
  // State to toggle dropdown visibility
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle dropdown
  const toggleDropdown = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border-black border p-4 rounded-md shadow-md w-full max-w-md mx-auto">
      {/* Main header */}
      <div
        className="cursor-pointer flex justify-between items-center bg-gray-100 p-3 rounded-md"
        onClick={toggleDropdown}
      >
        <h2 className="text-lg font-medium">Tabs Group</h2>
        <span>{isExpanded ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown content */}
      {isExpanded && (
        <div className="bg-white mt-2 rounded-md shadow-inner p-3">
          <ul className="space-y-2">
            {tabs.map((tab, index) => (
              <li
                key={index}
                className="border-b pb-2"
              >
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