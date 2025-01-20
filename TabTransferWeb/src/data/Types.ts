import { User } from "@supabase/supabase-js"


export interface Tabs {
    created_at : string
    favicon_url : string
    id : number
    url : string
    user_id : string
    title :  string
}

export type UserData = {
    user: User;
    stored: StoredUser;
};

export type StoredUser = {
    email: string;
    favorites_public: boolean;
    profile_image: string | null;
    user_id: string;
    username: string;
}

export type Group = {
    id: number;
    group_name: string;
    user_id: string;
    created_at: string;
    group_picture: string | undefined;
    description: string| undefined;
}