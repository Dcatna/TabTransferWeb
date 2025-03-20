import { DeleteSavedBrowserById, SaveCardToGroup } from "@/data/supabaseclient";
import { Tabs } from "../data/Types";
import { Button } from "./ui/button";
import { useUserStore } from "@/data/userstore";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

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
    <div className="border border-black p-4 rounded-md shadow-md bg-card w-full max-w-[550px] flex-grow transition-all">
        <div
            className="cursor-pointer flex items-center justify-between p-3 rounded-md"
            role="button"
        >

            <h2 className="text-lg font-medium flex-1 truncate">
                {tabs.length > 0 
                    ? `Saved - ${getRelativeTime(tabs[0]?.created_at || "Unknown time")}`
                    : "No Saved Tabs"}
            </h2>
            <div className="flex items-center gap-x-2">
                <Button onClick={restoreTabs} className="px-3 py-1 text-sm rounded">
                    Restore All
                </Button>
                <SaveCardDialog tabs={tabs}/>
                <Button onClick={() => handleDelete()} className="px-3 py-1 text-sm rounded bg-red-500 text-white">
                    Delete
                </Button>
            </div>
        </div>

        <div className="h-[200px] max-h-[200px] overflow-y-auto scrollbar-thin">
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

interface SaveCardProps {
  tabs : Tabs[]
}

const SaveCardDialog = ({tabs} : SaveCardProps) => {
  const [groupName, setGroupName] = useState<string>("")
  const [groupDescription, setGroupDescription] = useState<string>("")
  const refreshList = useUserStore((state) => state.refreshUserLists)
  const user_id = useUserStore((state) => state.userData?.user.id)
  const [open, setOpen] = useState(false)

  async function SaveToGroup(e: React.FormEvent) {
      e.preventDefault()
      await SaveCardToGroup(tabs, groupName, groupDescription, user_id!)
      refreshList()
      setOpen(false)
  }

  return (
      <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger onClick={() => setOpen(true)}>
              <Button className="bg-primary shadow-md">Save as Group</Button>
          </DialogTrigger>

          <DialogContent className="max-w-md p-6 rounded-lg bg-card shadow-lg">
              <h2 className="text-xl font-bold text-center">Save</h2>

              <form className="space-y-4" onSubmit={SaveToGroup}>
                  <div className="flex flex-col">
                      <label className="text-sm font-medium text-card-foreground mb-1">Group Name</label>
                      <input 
                          type="text" 
                          placeholder="Enter group name"
                          onChange={(e) => setGroupName(e.target.value)}
                          className="w-full p-2 border rounded-md bg-background text-card-foreground focus:ring focus:ring-primary"
                      />
                  </div>
                  <div className="flex flex-col">
                      <label className="text-sm font-medium text-card-foreground mb-1">Description</label>
                      <input 
                          type="text" 
                          placeholder="Enter description"
                          onChange={(e) => setGroupDescription(e.target.value)}
                          className="w-full p-2 border rounded-md bg-background text-card-foreground focus:ring focus:ring-primary"
                      />
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                      <Button type="button" className="bg-muted text-card-foreground">Cancel</Button>
                      <Button type="submit" className="bg-primary shadow-md">Save</Button>
                  </div>
              </form>  
          </DialogContent>
      </Dialog>
  )
}

export default TabCard;
