import { DeleteGroupByName, DeleteGroupItemByName, GetListItemsByName, InsertGroupItemByName } from "@/data/supabaseclient";
import { GroupResponse } from "@/data/Types";
import { useUserStore } from "@/data/userstore";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DialogHeader } from "./ui/dialog";
import type { Group } from "@/data/Types";

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
      // Open immediately in response to user action (avoids popup blockers)
      const newTab = window.open("", "_blank");
  
      if (newTab) {
        newTab.location.href = tab.url; // Set URL only if popup is allowed
      } else {
        console.error("Popup blocked!");
      }
    });
  };
  return (
<div className="min-h-screen bg-white p-4 w-full overflow-x-auto">
  <button
    onClick={() => navigate("/home")}          
    className="text-blue-600 font-bold"      
  >          
    ← Back 
  </button>

  <div className="bg-white p-4 shadow-md rounded-lg relative">
    <h1 className="text-2xl font-bold">{list.group_name}</h1>
    <p className="text-gray-600 mt-2">{list.description}</p>

    <div className="absolute top-4 right-4">
      <button
        onClick={handleRestore}
        className=" bg-brandYellow px-4 py-2 rounded-lg shadow-md hover:bg-hoverColor mr-1"
      >
        Restore
      </button>
      <button 
        onClick={handleDelete}
        className=" bg-brandYellow px-4 py-2 rounded-lg shadow-md hover:bg-hoverColor">
        Delete Group
      </button>
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
          className="bg-white p-4 shadow-md rounded-lg flex items-center space-x-4"
        >
          <img src={tab.favicon_url} alt="" className="w-10 h-10 flex-shrink-0" />
          
          <span className="flex-1 truncate">{tab.title}</span>
          
          <a href={tab.url}
            target="_blank"
            rel="noopener noreferrer" 
            className="flex-1 truncate text-gray-500">{tab.url} </a>
          
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

const getFaviconUrl = async (websiteUrl: string): Promise<string> => {
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
      <DialogTrigger className="bg-brandYellow hover:bg-hoverColor py-2 px-4 rounded-lg shadow-md" onClick={() => setOpen(true)}>
        Create Tab
      </DialogTrigger>
      <DialogContent className="max-w-lg p-6 rounded-lg bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800">
            Create New Tab List
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Provide details for your new tab list. You can edit or delete it later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="listName"
              className="block text-sm font-medium text-gray-700"
            >
              Url
            </label>
            <input
              type="text"
              id="Url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
              placeholder="Enter the url for the tab"
              required
            />
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Tab Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
              placeholder="Enter a title for the tab"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-brandYellow py-2 px-4 rounded-md hover:bg-hoverColor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandYellow"
            >
              Save Tab
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Group