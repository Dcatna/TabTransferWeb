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
import { ComputerIcon, InfoIcon, ListIcon, LogIn, LogOutIcon, LucideIcon, Moon, Plus, Sun } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./Theme";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";

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
      "text-md line-clamp-1 overflow-ellipsis bg-card text-card-foreground"
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
  const user = useUserStore((state) => state.userData?.user)


  async function handleSignout() {
    await signOutFunction()
    navigate("/signin")
  }

 
  return (
    <Sidebar
      {...props}
      collapsible="icon"
      variant="sidebar"
      className="max-h-screen overflow-hidden border-r border-gray-300 "
    >
      {user !== undefined ? 
      <SidebarHeader className="">
        

          <ModeToggle />
          <SidebarItem name="Signout" icon={LogOutIcon} className="   rounded-lg shadow-md" onClick={handleSignout}/>
        <CreateTabList />
      </SidebarHeader>
      : 
      <SidebarHeader className="">
        <SidebarItem name="Signin" icon={LogIn} className=" bg-backgroud text-foreground  rounded-lg shadow-md" onClick={() => navigate("/signin")}/>
        <ModeToggle />
      </SidebarHeader>
      }
      <SidebarContent className=" space-y-4">
      <SidebarGroup>
      
      <SidebarMenu>
      {lists.map((list, index) => (
          <Link to={`group/${list.id}`} state={list} className="border border-background rounded-lg">
            <SidebarItem key={index} icon={ListIcon} name={list.group_name} className="rounded-lg"></SidebarItem>
          </Link>
        ))}
      </SidebarMenu>
      </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 bg-background text-sm  text-center">
        <AboutSection/>
      </SidebarFooter>
    </Sidebar>
  );
};

function ModeToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <div className="z-50">
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full h-full justify-start">
        <SidebarItem name="Toggle Theme" icon={theme === "system" ? ComputerIcon :  theme === "dark" ? Moon : Sun} />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end"> 
        <Card className="bg-secondary z-50 p-2cursor-pointer text-start">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Button variant="ghost" className="w-full">
            Light
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Button variant="ghost" className="w-full"> 
            Dark
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Button variant="ghost" className="w-full">
            System
          </Button>
        </DropdownMenuItem>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
}

const AboutSection = () => {
  return (
    <Dialog >
      <DialogTrigger className=" bg-backgroud   rounded-lg shadow-md" >
      <SidebarItem name={"About This App"} icon={InfoIcon} />
      </DialogTrigger>
      <DialogContent className="max-w-lg p-6 rounded-lg  bg-card shadow-lg">
        <DialogDescription className="text-sm text-card-foreground ">
        <p className="font-bold">About this App:</p>
        <p>Tab Transfer is a web application designed to help users easily transfer tabs between their browsers.</p>
        <p>Users can create groups, add tabs, and save their lists for easy access.</p>
        <p>Users should also download the chrome extension TabTransfer to be able to save and re-open their browser state with ease.</p>
        <br/>
        <p className="font-bold">How To Use:</p>
        <p>Users can create tab groups by clicking Create Tab list. The idea for this is that you add common tabs to this list: Work, Content...</p>
        <p>Then you can click the restore button to quickly open them all up.</p>
        <p className="font-bold">If The Restore button is not working you must go to: </p>
        <p>chrome://settings/content/siteDetails?site=https://www.tabtransfer.org/</p>
        <p>And allow popups from this site. There is no way around this it is just common browser security.</p>
        <br/>
        <p className="font-bold">Chrome extension:</p>
        <p>The extension is for saving browser states (so saving all open tabs on your browser) Allowing you to save and restore tabs across computers and different browsers.</p>
        <p>To do this you click "Save Tabs". These saved tabs will show up on the home page of the website where you can manage them</p>
        <p>On the extension you can also click "Restore Recent Tabs" which will restore the most recently saved session.</p>
        <p>You can also access your groups, so you dont have to go to the website to open them</p>
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
      const res = await supabase
        .from("Groups")
        .insert({ group_name: listName, description: description, user_id: (await supabase.auth.getUser()).data.user?.id });

      if (res.error) {
        console.error("Error inserting tab list:", res.error.message);
        alert("Failed to create tab list. Please try again.");
        return;
      }


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
      
      <DialogTrigger className=" bg-backgroud text-foreground rounded-lg shadow-md" onClick={() => setOpen(true)}>
        <SidebarItem name={"Create Tab List"} icon={Plus} className="rounded-lg"/>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-6 rounded-lg  bg-backgroud shadow-lg bg-card">
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
              List Name
            </label>
            <input
              type="text"
              id="listName"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Enter a name for your tab list"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium "
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md sm:text-sm"
              placeholder="Enter a brief description of the tab list"
              rows={4}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="py-2 px-4 rounded-md "
            >
              Save Tab List
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppSidebar;
