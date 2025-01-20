import { Group, UserData } from "./Types";

export interface UserStore {
    userdata: UserData | undefined;
    lists: Group[];
    signIn: (email: string, password: string) => Promise<boolean>;
    refreshUserLists: () => Promise<void>;
    refreshUser: () => Promise<void>;
    refreshFavorites: () => Promise<void>;
    signOut: () => Promise<void>;
    init: () => () => void;
    createList: (
      name: string,
      description: string,
      pub: boolean
    ) => Promise<void>;
    deleteList: (listId: string) => Promise<void>;
  }