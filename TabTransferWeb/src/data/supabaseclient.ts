import { createClient, Session, User} from '@supabase/supabase-js'
import { StoredUser, Tabs } from './Types';


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

export async function getUserById(id: string): Promise<StoredUser | null> {
    try {
        const res = await supabase.from("users")
            .select()
            .filter("user_id", "eq", id)
            .limit(1)
            .order("user_id", { ascending: true })

        return res.data![0]
    } catch{}
    return null
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
     } catch {}
     return null
 }
