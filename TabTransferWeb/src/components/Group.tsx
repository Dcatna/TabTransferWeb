import { DeleteGroupByName, DeleteGroupItemByName, GetListItemsByName, InsertGroupItemByName } from "@/data/supabaseclient";
import { GroupResponse } from "@/data/Types";
import { useUserStore } from "@/data/userstore";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DialogHeader } from "./ui/dialog";
import type { Group } from "@/data/Types";
import { Button } from "./ui/button";

const Group = () => {
  const location = useLocation();
  const list = location.state as Group;
  const user = useUserStore((state) => state.userData?.user);
  const navigate = useNavigate()
  const [listData, setListData] = useState<GroupResponse[] | undefined>([]);
  const refreshLists = useUserStore((state) => state.refreshUserLists)


  useEffect(() => {
    async function getListData() {
      const data = await GetListItemsByName(list.group_name, user!.id);
      setListData(data);
    }
    getListData();
  }, [list, user]);

  const refreshListData = async () => {
    const data = await GetListItemsByName(list.group_name, user!.id);
    setListData(data);
  };

  async function RemoveFromList(tab: GroupResponse){
    const res = await DeleteGroupItemByName(tab.group_name, user!.id, tab.url, tab.id )
    if (!res) {
      alert("Failed to create tab list. Please try again.");
      return;
    }
    await refreshListData();
  }

  async function handleDelete() {
    await DeleteGroupByName(list.group_name, user!.id)
    refreshLists()
    navigate("/home")
  }

  
  const handleRestore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log(listData, "LISTDATA");
  
    listData?.forEach((tab) => {
      const newTab = window.open("", "_blank");
  
      if (newTab) {
        newTab.location.href = tab.url;
      } else {
        console.error("Popup blocked!");
      }
    });
  };
  return (
    <div className="min-h-screen  bg-backgroud p-4 w-full overflow-x-auto">
      <Button
        onClick={() => navigate("/home")}          
        className="font-bold mb-2"      
      >          
        ← Back 
      </Button>

      <div className="  p-4 shadow-md rounded-lg relative bg-card">
        <h1 className="text-2xl font-bold">{list.group_name}</h1>
        <p className="text-card-forground mt-2">{list.description}</p>

        <div className="absolute top-4 right-4">
          <Button
            onClick={handleRestore}
            className=" px-4 py-2 rounded-lg shadow-md  mr-1"
            
          >
            Restore
          </Button>
          <Button 
            onClick={handleDelete}
            className=" px-4 py-2 rounded-lg shadow-md"
            variant={"destructive"}>
            Delete Group
          </Button>
        </div>
        <div className="mt-6">
          <AddTabDialog group_name={list.group_name} refreshList={refreshListData} />
        </div>
      </div>

      <div className="mt-6 ">
        <h2 className="text-xl font-semibold mb-4">Tabs</h2>
        {listData && listData.length > 0 ? (
          <ul className="space-y-4">
          {listData.map((tab, index) => (
            <li
              key={index}
              className=" bg-card p-4 shadow-md rounded-lg flex items-center space-x-4"
            >
              <img src={tab.favicon_url} alt="" className="w-10 h-10 flex-shrink-0" />
              
              <span className="flex-1 truncate">{tab.title}</span>
              
              <a href={tab.url}
                target="_blank"
                rel="noopener noreferrer" 
                className="flex-1 truncate text-card-foreground">{tab.url} </a>
              
              <button
                className="text-red-500 hover:underline flex-shrink-0"
                onClick={() => RemoveFromList(tab)}
              >
                Remove Tab
              </button>
            </li>
          ))}
        </ul>
        ) : (
          <p className="text-gray-500">No tabs yet. Start by adding one!</p>
        )}
      </div>
    </div>

  );
};

interface AddTabDialogProp {
  group_name: string;
  refreshList: () => Promise<void>;
}

export const getFaviconUrl = async (websiteUrl: string): Promise<string> => {
  try {
    const normalizedUrl = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;
    const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(normalizedUrl).hostname}&sz=64`;
    return googleFaviconUrl;

    // Optional: Use other services as fallback or based on conditions
    // const duckDuckGoFaviconUrl = `https://icons.duckduckgo.com/ip3/${new URL(normalizedUrl).hostname}.ico`;
    // const iconHorseFaviconUrl = `https://icon.horse/icon/${new URL(normalizedUrl).hostname}`;

    // If a fallback is needed:
    // return duckDuckGoFaviconUrl or iconHorseFaviconUrl
  } catch (error) {
    console.error("Failed to fetch favicon:", error);

    // Fallback to /favicon.ico
    return `${websiteUrl}/favicon.ico`;
  }
};




const AddTabDialog = ({ group_name, refreshList }: AddTabDialogProp) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false); // Control dialog open state

  let faviconUrl = ""
  const user_id = useUserStore((state) => state.userData?.user.id);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      faviconUrl = await getFaviconUrl(url);
      const res = await InsertGroupItemByName(group_name, user_id!, url, title, faviconUrl);
      if (!res) {
        alert("Failed to create tab list. Please try again.");
        return;
      }

      setUrl("");
      setTitle("");
      setOpen(false);

      // Call the refresh function to reload the list
      await refreshList();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="  py-2 px-4 rounded-lg" onClick={() => setOpen(true)}>
        <Button className=" shadow-md">Create Tab</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-6 rounded-lg  bg-backgroud shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold ">
            Create New Tab List
          </DialogTitle>
          <DialogDescription className="text-sm ">
            Provide details for your new tab list. You can edit or delete it later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="listName"
              className="block text-sm font-medium "
            >
              Url
            </label>
            <input
              type="text"
              id="Url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Enter the url for the tab"
              required
            />
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium"
            >
              Tab Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Enter a title for the tab"
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              className=" bg-primary "
            >
              Save Tab
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Group