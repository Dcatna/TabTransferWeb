import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { CreateTabBundle} from "@/data/supabaseclient"

import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog"
import { useState } from "react"

import { DialogHeader } from "./ui/dialog"
import { TabBundle } from "@/data/Types"


const TabBundlerCreate = () => {
  const navigate = useNavigate()
  const [listData, setListData] = useState<TabBundle[]>([])

  function handleAddToList(tab: TabBundle) {
    setListData((prev) => [...prev, tab])
  }

  function RemoveFromList(tab: TabBundle) {
    setListData((prev) => prev.filter((t) => t.url !== tab.url))
  }

  async function handleBundleExport(tabs: TabBundle[]) {
    try {
      const export_id = await CreateTabBundle(tabs)
      const copy_url = `https://www.tabtransfer.org/view_bundle/${export_id}`
      // const copy_url = `http://localhost:5173/view_bundle/${export_id}`

      await navigator.clipboard.writeText(copy_url)
  
      alert("Bundle link copied to clipboard!")
    } catch (error) {
      console.error("Failed to copy:", error)
      alert("Failed to copy the link. Please try again.")
    }
  }
  
  return (
    <div className="min-h-screen bg-background p-6 w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => navigate("/home")} className="font-bold">
          ← Back
        </Button>
        <Button onClick={() => handleBundleExport(listData)} className="bg-primary shadow-md">
          Export Bundle
        </Button>
      </div>

      <div className="p-6 shadow-md rounded-lg bg-card">
        <h1 className="text-3xl font-bold mb-2">Create Tab Bundle</h1>
        <p className="text-card-foreground">Group multiple tabs together for easy access.</p>

        <div className="mt-6">
          <AddTabDialog handleAddToList={handleAddToList} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tabs in this Bundle</h2>
        {listData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listData.map((tab, index) => (
              <div key={index} className="bg-card p-4 shadow-md rounded-lg flex flex-col space-y-2">
                <div className="flex items-center space-x-4">
                  <img src={tab.favicon_url} alt="" className="w-8 h-8 flex-shrink-0" />
                  <span className="flex-1 truncate font-medium">{tab.title}</span>
                </div>
                <a href={tab.url} target="_blank" rel="noopener noreferrer" className="truncate text-primary hover:underline">
                  {tab.url}
                </a>
                <Button
                  variant="destructive"
                  onClick={() => RemoveFromList(tab)}
                  className="w-full mt-2"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-4 text-center">No tabs yet. Start by adding one!</p>
        )}
      </div>
    </div>
  );
};


interface AddTabDialogProp {
  handleAddToList: (tab: TabBundle) => void;
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




const AddTabDialog = ({ handleAddToList }: AddTabDialogProp) => {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [open, setOpen] = useState(false)

  let faviconUrl = ""

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      faviconUrl = await getFaviconUrl(url)
      handleAddToList({"title": title, "url": url, "favicon_url": faviconUrl})

      setUrl("")
      setTitle("")
      setOpen(false)

 
    } catch (err) {
      console.error("Unexpected error:", err)
      alert("An unexpected error occurred. Please try again.")
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
              className="mt-1 block w-full rounded-md shadow-sm"
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
              className="mt-1 block w-full rounded-md shadow-sm"
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


export default TabBundlerCreate