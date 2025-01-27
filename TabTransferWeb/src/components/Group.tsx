import { DeleteGroupItemByName, GetListItemsByName, InsertGroupItemByName } from "@/data/supabaseclient";
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

  async function RemoveFromList(url: string){
    const res = await DeleteGroupItemByName(list.group_name, user!.id, url )
    if (!res) {
      alert("Failed to create tab list. Please try again.");
      return;
    }
    await refreshListData();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-full">
     <button
        onClick={() => navigate(-1)}          
        className="text-blue-600 font-bold"      >          
        ← Back 
    </button>
      {/* Header Section */}
      <div className="bg-white p-4 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold">{list.group_name}</h1>
        <p className="text-gray-600 mt-2">{list.description}</p>
        <div className="mt-6">
        <AddTabDialog group_name={list.group_name} refreshList={refreshListData} />
      </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Tabs</h2>
        {listData && listData.length > 0 ? (
          <ul className="space-y-4">
            {listData.map((tab, index) => (
              <li
                key={index}
                className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center"
              >
                <img src={tab.favicon_url} alt="" />
                <span>{tab.title}</span>
                <button className="text-red-500 hover:underline" onClick= {()=> RemoveFromList(tab.url)}>
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
    // Ensure the URL has a protocol
    if (websiteUrl.includes("github.com")) {
      return "https://github.githubassets.com/favicons/favicon.svg";
    }
    
    const normalizedUrl = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;

    // Fetch the HTML content of the website
    const response = await fetch(normalizedUrl);
    const html = await response.text();

    // Parse the HTML to extract the favicon link
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const iconLink = doc.querySelector("link[rel~='icon']") as HTMLLinkElement;

    // Resolve favicon URL
    if (iconLink) {
      // Handle relative paths for the favicon
      return new URL(iconLink.getAttribute("href") || "", normalizedUrl).href;
    }

    // Fallback to /favicon.ico if no icon link is found
    return `${normalizedUrl}/favicon.ico`;
  } catch (error) {
    console.error("Failed to fetch favicon:", error);

    // Fallback to /favicon.ico if fetching fails
    return `${websiteUrl}/favicon.ico`;
  }
};



const AddTabDialog = ({ group_name, refreshList }: AddTabDialogProp) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const user_id = useUserStore((state) => state.userData?.user.id);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const faviconUrl = await getFaviconUrl(url);
      const res = await InsertGroupItemByName(group_name, user_id!, url, title, faviconUrl);
      if (!res) {
        alert("Failed to create tab list. Please try again.");
        return;
      }

      alert("Tab list created successfully!");

      setUrl("");
      setTitle("");
      setFaviconUrl("");

      // Call the refresh function to reload the list
      await refreshList();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-white text-violet-500 hover:bg-violet-100 py-2 px-4 rounded-lg shadow-md">
        Create Tab List
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
              className="bg-violet-500 text-white py-2 px-4 rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
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