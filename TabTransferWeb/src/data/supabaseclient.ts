import { createClient} from '@supabase/supabase-js'


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

export async function GetUserTabs(user_id : string | undefined) {
    const {data: latestTabs, error : latestError} = await supabase.from("Tabs").select("*").eq("user_id", user_id).order("created_at", {ascending: false})
    if (latestError) {
        throw latestError
    }
    if (latestTabs.length > 0 && latestTabs) {
        const most_recent = latestTabs[0].created_at
        const {data, error} = await supabase.from("Tabs").select("url").eq("user_id", user_id).eq("created_at", most_recent)

        if(error) {
            throw error
        }
        return data 
    }
}