import { Tabs } from "../data/Types";

interface TabCardProps {
  tabs: Tabs[];
  isExpanded: boolean;
  toggleDropdown: () => void;
}

const TabCard = ({ tabs, isExpanded, toggleDropdown }: TabCardProps) => {
  const restoreTabs = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    tabs.forEach((tab) => {
      window.open(tab.url, "_blank");
    });
  };

  return (
    <div className="border-black border p-4 rounded-md shadow-md w-full max-w-md mx-auto">
      <div
        className="cursor-pointer flex justify-between items-center bg-gray-100 p-3 rounded-md"
        onClick={toggleDropdown}
        role="button"
        aria-expanded={isExpanded}
      >
        <h2 className="text-lg font-medium">Tabs Group</h2>
        <button
          onClick={restoreTabs}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none"
        >
          Restore All
        </button>
        <span>{isExpanded ? "▲" : "▼"}</span>
      </div>

      {isExpanded && (
        <div className="bg-white mt-2 rounded-md shadow-inner p-3">
          <ul className="space-y-2">
            {tabs.map((tab, index) => (
              <li
                key={index}
                className="border-b pb-2 flex items-center space-x-2"
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

export default TabCard;
