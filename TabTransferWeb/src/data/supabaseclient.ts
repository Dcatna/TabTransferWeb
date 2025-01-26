import { createClient, Session, User} from '@supabase/supabase-js'
import { Group, GroupResponse, StoredUser, Tabs } from './Types';


export const supabase = createClient(
    'https://jdimaknvdhxpcbvcctem.supabase.co', 
    import.meta.env.VITE_SUPABASE_API_KEY
)

export async function GetSignedInUser() {
    const { data: { session } } = await supabase.auth.getSession(); //check if user is already authenticated

    if (session) {
        return true
    }
    return false
}

export async function SignOut() {
    const data = await supabase.auth.signOut()
    return data
}

export async function GetMostRecentUserTabs(user_id : string | undefined) : Promise<Tabs[] | undefined> {
    const {data: latestTabs, error : latestError} = await supabase.from("Tabs").select("*").eq("user_id", user_id).order("created_at", {ascending: false})
    console.log(latestTabs)
    if (latestError) {
        throw latestError
    }
    if (latestTabs.length > 0 && latestTabs) {
        const most_recent = latestTabs[0].created_at
        const {data, error} = await supabase.from("Tabs").select("*").eq("user_id", user_id).eq("created_at", most_recent)

        if(error) {
            throw error
        }
        return data as Tabs[] || undefined
    }
    return undefined
}

export async function GetUserTabsWithinMonth(user_id : string | undefined) :  Promise<Tabs[] | undefined> {
    const oneMonthTime = new Date()
    oneMonthTime.setMonth(oneMonthTime.getMonth() - 1)
    const {data, error } = await supabase.from("Tabs").select("*").eq("user_id", user_id).gte("created_at", oneMonthTime.toISOString())

    if (error) {
        throw error
    }

    return data as Tabs[] || undefined

}

export async function GetUserGroups(user_id : string) : Promise<Group[] | undefined> {
    const {data, error} = await supabase.from("Groups").select("*").eq("user_id", user_id)
    if (error) {
        throw error
    }
    console.log(data, "GOUPS")
    return data as Group[] || undefined
}

export async function getUserById(id: string): Promise<StoredUser | null> {
    try {
        console.log(id)
      const { data, error } = await supabase.auth.getUser(id)
  
      if (error) {
        console.error("Error fetching user by ID:", error.message);
        return null;
      }
     
      console.log("Fetched user from auth.users:", data);
      return {
        user_id: data.user.id,
        email: data.user.email!,
        username: data.user.email!.split("@")[0],
        profile_image: "",
      } satisfies StoredUser

    } catch (err) {
      console.error("Error querying auth.users table:", err);
      return null;
    }
  }
  

export async function signInWithEmailAndPassword(email: string, password: string): Promise<{user: User, session: Session} | null> {
    try {
        const result = await supabase.auth.signInWithPassword({
            email: email,
            password: password
         })
         if (result.data.user && result.data.session) {
            return result.data
         }
     } catch {
        return null
     }
     return null
 }

export async function GetListItemsByName(group_name : string, user_id: string) : Promise<GroupResponse[] | undefined> {
    
    const { data, error } = await supabase.from("GroupItems").select("*").eq("group_name", group_name).eq("user_id", user_id)
    if (error) {
        throw error
    }
    return data as GroupResponse[] || undefined

}

export async function InsertGroupItemByName(group_name : string, user_id: string, url: string, favicon_url: string | undefined, title : string) {
    const res = await supabase.from("GroupItems").insert(
        {group_name: group_name, 
            user_id: user_id, 
            url: url, 
            favicon_url: favicon_url,
            title: title})
            
    if (res.error) {
        return false
    }
    return true
}