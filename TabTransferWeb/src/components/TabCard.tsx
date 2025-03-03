import { DeleteSavedBrowserById } from "@/data/supabaseclient";
import { Tabs } from "../data/Types";
import { Button } from "./ui/button";

interface TabCardProps {
  tabs: Tabs[];
  onDelete: () => void;
}

const TabCard = ({ tabs, onDelete }: TabCardProps) => {

  async function handleDelete() {
    await Promise.all(tabs.map(tab => DeleteSavedBrowserById(tab.id, tab.user_id, tab.url, tab.created_at)))

    
    onDelete()

  }


  const restoreTabs = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    tabs.forEach((tab) => {
      window.open(tab.url, "_blank");
    });
  };
  const getRelativeTime = (timestamp: string) => {
    const createdAt = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const key in intervals) {
      const value = intervals[key];
      const elapsed = Math.floor(diffInSeconds / value);
      if (elapsed > 0) {
        return elapsed === 1
          ? `1 ${key} ago`
          : `${elapsed} ${key}s ago`;
      }
    }

    return "Just now";
  };
  
  return (
    <div className="border border-black p-4 rounded-md shadow-md bg-card w-full max-w-[450px] flex-grow transition-all">
      <div
        className="cursor-pointer flex items-center justify-between p-3 rounded-md"
        role="button"
      >
        <h2 className="text-lg font-medium flex-1 truncate">Saved - {getRelativeTime(tabs[0].created_at)}</h2>
        <div className="flex-shrink-0">
          <Button
            onClick={restoreTabs}
            className=" px-2 py-1 text-sm rounded focus:outline-none"
          >
            Restore All
          </Button>
          <Button onClick={() => handleDelete()} className="px-2 py-1 text-sm rounded focus:outline-none ml-1">
            Delete
          </Button>
        </div>
    
      </div>

      <div className="h-[200px] max-h-[200px] overflow-y-auto scrollbar-thin ">
        <ul className="mt-2 space-y-2">
          {tabs.map((tab, index) => (
            <li key={index} className="flex items-center space-x-2">
              <img src={tab.favicon_url || "https://via.placeholder.com/16"} className="w-6 h-6" alt="" />
              <a href={tab.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">
                {tab.title || tab.url}
              </a>
            </li>
          ))}
        </ul>
      </div>


    </div>

  );
};

export default TabCard;
