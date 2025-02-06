import { DeleteSavedBrowserById } from "@/data/supabaseclient";
import { Tabs } from "../data/Types";

interface TabCardProps {
  tabs: Tabs[];
  isExpanded: boolean;
  toggleDropdown: () => void;
}

const TabCard = ({ tabs, isExpanded, toggleDropdown }: TabCardProps) => {

  function handleDelete() {
    tabs.forEach(async tab => {
      await DeleteSavedBrowserById(tab.id, tab.user_id, tab.url, tab.created_at)
    })
  }
  const restoreTabs = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    tabs.forEach((tab) => {
      window.open(tab.url, "_blank");
    });
  };

  
  return (
    <div className="border border-black p-4 rounded-md shadow-md bg-white w-full flex-grow transition-all">
      <div
        className="cursor-pointer flex items-center justify-between p-3 rounded-md"
        onClick={toggleDropdown}
        role="button"
        aria-expanded={isExpanded}
      >
        <h2 className="text-lg font-medium flex-1">Tabs Group</h2>
        <div className="flex-shrink-0">
          <button
            onClick={restoreTabs}
            className="bg-violet-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600 focus:outline-none"
          >
            Restore All
          </button>
          <button onClick={() => handleDelete()} className="bg-violet-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600 focus:outline-none ml-1">
            Delete
          </button>
        </div>
        <span className="ml-2">{isExpanded ? "▲" : "▼"}</span>
      </div>
      {isExpanded && (
        <div className="bg-gray-50 mt-2 rounded-md shadow-inner p-3">
          <ul className="space-y-2">
            {tabs.map((tab, index) => (
              <li
                key={index}
                className="border-b pb-2 flex items-center space-x-3"
              >
                <img
                  src={tab.favicon_url || "https://via.placeholder.com/16"}
                  className="w-6 h-6"
                  alt={tab.title || "No Title"}
                />
                <a
                  href={tab.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline truncate flex-1"
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

export default TabCard;
