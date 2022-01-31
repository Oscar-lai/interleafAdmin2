import {createContext, useContext} from 'react';

export interface IUser {
    token: string;
    uid: string;
    type: string;
    isLogin: boolean;
}

export interface IuserContext {
    myUser: IUser;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
}

export const UserContext = createContext<IuserContext>({
    myUser: {
        token: '',
        uid: '',
        type: '',
        isLogin: false
    },
    setUser: () => {}
});

export const useUserContext = () => useContext(UserContext);
