import { failureResult, Result, successResult } from "@/lib/utils";
import { getUserById, GetUserGroups, signInWithEmailAndPassword, supabase } from "./supabaseclient";
import { Group, UserData } from "./Types";
import {create } from "zustand"


export interface UserStore {
    userData: UserData | undefined;
    lists: Group[];
    signIn: (email: string, password: string) => Promise<boolean >;
    refreshUserLists: () => Promise<void>;
    refreshUser: () => Promise<void>;
    signOut: () => Promise<void>;
    init: () => () => void;
    createList: (
      name: string,
      description: string,
      pub: boolean
    ) => Promise<void>;
    deleteList: (listId: string) => Promise<void>;
  }


  function getInitialUserData() {
    try {
      // Fetch the stored data from localStorage
      const userString = localStorage.getItem("user");
      const storedString = localStorage.getItem("stored");
  
      // Parse the JSON strings into objects
      const user = userString ? JSON.parse(userString) : null;
      const stored = storedString ? JSON.parse(storedString) : null;  
      // Validate the data and return UserData if valid
      if (user && stored && user.user.id === stored.user_id) {
        return {
          user: user.user, // Access the nested user object
          stored: stored,
        };
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
    return undefined;
  }

  export const useUserStore = create<UserStore>((set, get) => ({
    userData: getInitialUserData(),
    lists: [],
    init: () => {


      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        console.log(event, session)

         if (event === "SIGNED_IN") {
          // handle sign in event
          get()
            .refreshUser()
            .then(() => {
              get().refreshUserLists();
            });
        } else if (event === "SIGNED_OUT") {
          localStorage.removeItem("user")
          localStorage.removeItem("stored")
          set({
            userData: undefined,
            lists: [],
          });
        } else if (event === "PASSWORD_RECOVERY") {
          // handle password recovery event
        } else if (event === "TOKEN_REFRESHED") {
          // handle token refreshed event
        } else if (event === "USER_UPDATED") {
          // handle user updated event
          get().refreshUser();
        }
      })
      initializeUser().then((result) => {
        if (!result.ok) {
          localStorage.removeItem("user")
          localStorage.removeItem("stored")
          return
        }
        localStorage.setItem("user", JSON.stringify(result.data.user))
        localStorage.setItem("stored", JSON.stringify(result.data.stored))
        set({
          userData: result.data,
        });
  
        get().refreshUserLists();
      });
      return data.subscription.unsubscribe
    },
    signIn: async (email: string, password: string) => {
      const result = await signInWithEmailAndPassword(email, password);
      
      if(result) {
        const stored = await getUserById(result.user.id)
        if (!stored) {
          console.warn("User ID not found in database");
          return false;
        }
        set({
          userData: {
            user: result.user,
            stored: stored,
          }
        })
        get().refreshUserLists();
        return true
      }
      return false
    },
  
    refreshUser: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }
      const id = data.user?.id;
      if (!id) {
        console.warn("No user ID found");
        return;
      }
      const stored = await getUserById(id);
      if (!stored) {
        console.warn("User ID not found in database");
        return;
      }
      // Overwrite localStorage with the latest data
      localStorage.setItem("user", JSON.stringify({ user: data.user }));
      localStorage.setItem("stored", JSON.stringify(stored));
      set({
        userData: {
          user: data.user,
          stored: stored,
        },
      });
    },
  
    refreshUserLists: async () => {
      const user_id = get().userData?.user.id
      if(!user_id) {
        set({lists: []})

      } else {
        const result = await GetUserGroups(user_id)
        set({lists:result})
      }
    },
  
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign-out error:", error.message);
        return;
      }
      set({
        userData: undefined,
        lists: [],
      });
    },
  
    createList: async (name: string, description: string, pub: boolean) => {
      const res= await supabase
        .from("Groups")
        .insert([{ group_name: name, description, public: pub }]);
      if (res.error) {
        console.error("Error creating list:", res.error.message);
        return;
      }
      get().refreshUserLists();
    },
  
    deleteList: async (listId: string) => {
      const { error } = await supabase.from("Groups").delete().eq("id", listId);
      if (error) {
        console.error("Error deleting list:", error.message);
        return;
      }
      get().refreshUserLists();
    },
    
  }))

  async function initializeUser(): Promise<Result<UserData, unknown>> {
    const user = await supabase.auth.getUser();
    if (user.error) {
      return failureResult(user.error);
    }

    return successResult({
      user: user.data.user,
      stored: {
        email: user.data.user.email || "", 
        profile_image: "",
        user_id: user.data.user.id, 
        username: user.data.user.email?.split("@")[0] || "unknown",
      },
    });
  }