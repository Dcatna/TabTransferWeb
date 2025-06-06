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

export type GroupResponse = {
    id : number;
    group_name : string;
    user_id : string;
    created_at : string;
    group_picture : string | null;
    favicon_url : string; 
    title : string;
    url: string;
}

export type TabBundle = {
    title: string;
    url: string;
    favicon_url: string;
    
}

export type ExportedBundle = {
    bundle_id: string;
    created_at: string;
    id: number;
    urls: TabBundle[]
}