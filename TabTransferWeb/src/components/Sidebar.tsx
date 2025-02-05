import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { supabase } from "@/data/supabaseclient";
import { useUserStore } from "@/data/userstore";
import { useState } from "react";
import { Link } from "react-router-dom";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  //const user = useUserStore((state) => state.userData?.user)
  const lists = useUserStore((state) => state.lists) || []
  return (
    <Sidebar
      {...props}
      collapsible="icon"
      className="max-h-screen overflow-hidden border-r border-gray-300 bg-gray-100"
    >
 
      <SidebarHeader className="bg-violet-500 p-4 text-white text-lg font-semibold">
        <CreateTabList />
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-4">
        {lists.map((list, index) => (
          
          <Link to={`group/${list.id}`} state={list}>
            <SidebarGroup className="p-3 bg-white rounded-lg shadow-md" key={index}>{list.group_name}</SidebarGroup>
          </Link>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="p-4 bg-gray-200 text-sm text-gray-600 text-center">
        Footer Content
      </SidebarFooter>
    </Sidebar>
  );
};

const CreateTabList = () => {
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");
  const refreshList = useUserStore((state) => state.refreshUserLists)
  const [open, setOpen] = useState(false);
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("Groups")
        .insert({ group_name: listName, description: description, user_id: (await supabase.auth.getUser()).data.user?.id });

      if (error) {
        console.error("Error inserting tab list:", error.message);
        alert("Failed to create tab list. Please try again.");
        return;
      }

      console.log("Tab list created:", data);
      setListName("");
      setDescription("");
      refreshList()
      setOpen(false);
      
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-white text-violet-500 hover:bg-violet-100 py-2 px-4 rounded-lg shadow-md" onClick={() => setOpen(true)}>
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
              List Name
            </label>
            <input
              type="text"
              id="listName"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
              placeholder="Enter a name for your tab list"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
              placeholder="Enter a brief description of the tab list"
              rows={4}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-violet-500 text-white py-2 px-4 rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Save Tab List
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppSidebar;
