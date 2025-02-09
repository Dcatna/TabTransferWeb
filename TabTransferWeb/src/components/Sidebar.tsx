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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/data/supabaseclient";
import { useUserStore } from "@/data/userstore";
import { cn } from "@/lib/utils";
import { HomeIcon, InfoIcon, LogOutIcon, LucideIcon, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  icon: LucideIcon;
  onClick?: () => void;
  selected?: boolean;
}
export function SidebarItem(props: SidebarProps) {
  const { open } = useSidebar();
  return (
    <SidebarMenuItem className={cn( props.className,  
      "fade-in fade-out transition-all duration-350 ease-in-out",
      "text-md line-clamp-1 overflow-ellipsis"
    )}>
      <SidebarMenuButton
        variant={props.selected ? "outline" : "default"}
        onClick={props.onClick}
        className="w-full h-full"
      >

        <props.icon />
        <text
          className={open ? "opacity-100" : "opacity-0"}
        >
          {props.name}
        </text>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const lists = useUserStore((state) => state.lists)
  const navigate = useNavigate()
  const signOutFunction = useUserStore((state) => state.signOut)

  async function handleSignout() {
    await signOutFunction()
    navigate("/signin")
  }

 
  return (
    <Sidebar
      {...props}
      collapsible="icon"
      variant="sidebar"
      className="max-h-screen overflow-hidden border-r border-gray-300 bg-gray-100"
    >

      <SidebarHeader className="bg-brandYellow p-4 text-white text-lg font-semibold">
        <SidebarItem name="Signout" icon={LogOutIcon} className="bg-white text-brandYellow hover:bg-violet-100 rounded-lg shadow-md" onClick={handleSignout}/>
        <CreateTabList />
      </SidebarHeader>
 
      <SidebarContent className=" space-y-4">
      <SidebarGroup>
      <SidebarMenu>
      {lists.map((list, index) => (
          <Link to={`group/${list.id}`} state={list} className="border border-brandYellow rounded-md hover:bg-hoverColor">
            <SidebarItem key={index} icon={HomeIcon} name={list.group_name}></SidebarItem>
          </Link>
        ))}
      </SidebarMenu>
      </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 bg-gray-200 text-sm text-gray-600 text-center">
        <AboutSection/>
      </SidebarFooter>
    </Sidebar>
  );
};

const AboutSection = () => {
  return (
    <Dialog >
      <DialogTrigger className="bg-white text-yellow-600 hover:bg-violet-100  rounded-lg shadow-md" >
      <SidebarItem name={"About This App"} icon={InfoIcon} />
      </DialogTrigger>
      <DialogContent className="max-w-lg p-6 rounded-lg bg-white shadow-lg">
        <DialogDescription className="text-sm text-gray-600">
          Tab Transfer is a web application designed to help users easily transfer tabs between their browsers. Users can create groups, add tabs, and save their lists for easy access.
          Users should also download the chrome extension TabTransfer to be able to save their browser state.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

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
      
      <DialogTrigger className="bg-white text-brandYellow hover:bg-violet-100 rounded-lg shadow-md" onClick={() => setOpen(true)}>
        <SidebarItem name={"Create Tab List"} icon={Plus} />
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
