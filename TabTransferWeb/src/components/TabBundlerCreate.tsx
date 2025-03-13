import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { CreateTabBundle} from "@/data/supabaseclient"

import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog"
import { useState } from "react"

import { DialogHeader } from "./ui/dialog"

import { TabBundle } from "@/data/Types"
import { getFaviconUrl } from "./Group"

interface Export {
  submitted : boolean,
  bundle_id : string
}

const TabBundlerCreate = () => {
  const navigate = useNavigate()
  const [tabBundle, setTabBundle] = useState<TabBundle[]>([])
  const [submitted, setSubmitted] = useState<Export>({"submitted" : false, "bundle_id" : ""})

  function removeFromList(tabPassed : TabBundle) {
    setTabBundle(tabBundle.filter(tab => tab.url != tabPassed.url))
  }

  function addToBundle(tab : TabBundle[]) {
    setTabBundle(prev => [...prev, ...tab])
  }

  function getBundleID(bundle_id: string, submitted: boolean) {
    setSubmitted({"bundle_id" : bundle_id, "submitted": submitted})
  }

  return (
    <div className="min-h-screen  bg-backgroud p-4 w-full overflow-x-auto">
      <Button
        onClick={() => navigate("/home")}          
        className="font-bold mb-2"      
      >          
        ← Back 
      </Button>

      <div className="  p-4 shadow-md rounded-lg relative bg-card">
        <h1 className="text-2xl font-bold">Create Tab Bundle</h1>
        <h2 className="mt-1">Create a Group of Tabs to send</h2>
        {submitted === false ? <div className="mt-6">
          <AddTabDialog addToBundle={addToBundle} />
        </div> : <Button className="mt-2">Export</Button>}
      </div>

      <div className="mt-6 ">
        <h2 className="text-xl font-semibold mb-4">Tabs</h2>
        {tabBundle && tabBundle.length > 0 ? (
          <ul className="space-y-4">
          {tabBundle.map((tab, index) => (
            <li
              key={index}
              className=" bg-card p-4 shadow-md rounded-lg flex items-center space-x-4"
            >
              <img src={tab.favicon_url} alt="" className="w-10 h-10 flex-shrink-0" />
              
              <a href={tab.url}
                target="_blank"
                rel="noopener noreferrer" 
                className="flex-1 truncate text-card-foreground">{tab.url} </a>
              
              <button
                className="text-red-500 hover:underline flex-shrink-0"
                onClick={() => removeFromList(tab)}
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
  )
}

interface TabDialogProp {
  addToBundle : (tab: TabBundle[]) => void
  getBundleId: (bundle_id: string, submitted: boolean) => void
}
const AddTabDialog = ({ addToBundle, getBundleId }: TabDialogProp) => {
  const [urls, setUrls] = useState<string>("")
  const [open, setOpen] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const urlList = urls
      .split("\n")
      .map(url => url.trim())
      .filter(url => url.length > 0)
  
    if (urlList.length === 0) {
      alert("Please enter at least one valid URL.")
      return
    }
  
    try {
      // Fetch favicons for all URLs
      const tabsToAdd: TabBundle[] = await Promise.all(
        urlList.map(async (url) => {
          const faviconUrl = await getFaviconUrl(url)
          return { url, favicon_url: faviconUrl }
        })
      );
  
      // Create a tab bundle in the database
      const bundleId = await CreateTabBundle(tabsToAdd)
      if (!bundleId) {
        alert("Failed to create tab bundle. Please try again.")
        return
      }
  
      addToBundle(tabsToAdd);
      getBundleId(bundleId, true)
       
      setUrls("")
      setOpen(false)
    } catch (err) {
      console.error("Unexpected error:", err)
      alert("An unexpected error occurred. Please try again.")
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="py-2 px-4 rounded-lg">
        <Button className="shadow-md">Create Tab</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-6 rounded-lg bg-background shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Create New Tab List</DialogTitle>
          <DialogDescription className="text-sm">
            Paste multiple URLs (one per line) to add multiple tabs at once.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="urls" className="block text-sm font-medium">
              URLs (one per line)
            </label>
            <textarea
              id="urls"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="mt-1 block w-full rounded-md shadow-sm p-2 border border-gray-300"
              placeholder="Enter one URL per line..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-primary">Save Tabs</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default TabBundlerCreate