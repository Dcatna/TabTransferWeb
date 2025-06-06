import { createClient, Session, User} from '@supabase/supabase-js'
import { ExportedBundle, Group, GroupResponse, StoredUser, TabBundle, Tabs } from './Types';
import { v4 as uuidv4 } from "uuid";

export const supabase = createClient(
    'https://jdimaknvdhxpcbvcctem.supabase.co', 
    import.meta.env.VITE_SUPABASE_API_KEY
)

export async function GetSignedInUser() {
    const { data: { session } } = await supabase.auth.getSession()

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
    return data as Group[] || undefined
}

export async function getUserById(id: string): Promise<StoredUser | null> {

    const { data, error } = await supabase.from("Users").select("*").eq("user_id", id)
  
    if (error) {
        console.error("Error fetching user by ID:", error.message);
        return null;
    }
    if(data.length <= 0 || !data) {
        console.error("No user found");
        return null
    }
    console.log("Fetched user from Users table:", data[0])

    return {
        user_id: data[0].user_id,
        email: data[0].email,
        username: data[0].username,
    } satisfies StoredUser

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

export async function InsertGroupItemByName(group_name : string, user_id: string, url: string, title : string, favicon_url: string | undefined) {
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

export async function DeleteGroupItemByName(group_name: string, user_id: string, url: string, tab_id : number) {
    const res = await supabase.from("GroupItems").delete().eq("group_name", group_name).eq("user_id", user_id).eq("url", url).eq("id", tab_id)
    if (res.error) {
        return false
    }
    return true
}

export async function DeleteSavedBrowserById(id: number, user_id: string, url: string, created_at: string) {
    const res = await supabase.from("Tabs").delete().eq("id", id).eq("user_id", user_id).eq("url", url).eq("created_at", created_at)

    if(res.error) {
        console.log(res.error)
        return false
    }
    return true

}

export async function DeleteGroupByName(group_name: string, user_id:string) {
    const res = await supabase.from("Groups").delete().eq("group_name", group_name).eq("user_id", user_id)

    if(res.error) {
        console.log(res.error)
        return false
    }

    return true
}

export async function CreateTabBundle(urls: TabBundle[]) {
    const id = uuidv4()
    const created_at = new Date().toISOString()
    const res = await supabase.from("TabBundle").insert({"bundle_id":id, "urls":urls, "created_at":created_at})
    if (res.error) {
        throw res.error
    }else {
        return id
    }
    
}

export async function GetTabBudleByID(id: string): Promise<ExportedBundle | null> {
    const { data, error } = await supabase
        .from("TabBundle")
        .select("*")
        .eq("bundle_id", id)
        .limit(1)
        .single()

    if (error) {
        console.error("Error fetching bundle:", error)
        return null
    }

    return data as ExportedBundle
}


export async function SaveBundleToGroup(bundleData : ExportedBundle, group_name: string, description: string, user_id: string) {
    try {
        const created_at = new Date().toISOString()
        const { data, error } = await supabase
            .from("Groups")
            .insert({ 
                group_name: group_name, 
                description: description, 
                user_id: user_id, 
                created_at: created_at 
            })

        if (error) {
            console.error("Error inserting group:", error)
            throw error
        }
        console.log(data, "SAVE GROUP")
        const results = await Promise.all(
            bundleData.urls.map(async (tab) => {
                const { data: data2, error: error2 } = await supabase
                    .from("GroupItems")
                    .insert({
                        url: tab.url,
                        title: tab.title,
                        created_at,
                        favicon_url: tab.favicon_url,
                        user_id,
                        group_name,
                    })

                if (error2) {
                    console.error("Error inserting tab:", error2)
                    throw error2
                }

                return data2
            })
        )

        console.log("Successfully inserted group & tabs:", results)
        return data
    } catch (err) {
        console.error("Unexpected error:", err)
        throw err
    }
    
}

export async function SaveCardToGroup(tabs: Tabs[], group_name: string, description: string, user_id: string) {
    try {
        const created_at = new Date().toISOString()
        const result = await supabase.from("Groups").insert({group_name: group_name, description: description, user_id: user_id})
        if(result.error) {
            throw result.error
        }
        const res = await Promise.all(
            tabs.map(async (tab) => {
                const {data, error} = await supabase.from("GroupItems")
                .insert({
                    url: tab.url,
                    title: tab.title,
                    favicon_url: tab.favicon_url,
                    user_id: tab.user_id,
                    created_at: created_at,
                    group_name: group_name
                })

                if(error) {
                    throw error
                }

                return data
            })
        )
        return res
    } catch (err) {
        throw err
    }
}