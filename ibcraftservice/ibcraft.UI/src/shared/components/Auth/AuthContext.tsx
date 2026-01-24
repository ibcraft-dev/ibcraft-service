"use client"

import { fetchCheckToken, fetchUser } from "@hooks/hookUser";
import { User } from "@hooks/IUser";
import { useEffect, useState, createContext, useContext } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Loader from "../Loader";


interface AuthContextType {
    user: User | null;
    isAuth?: boolean;
    login: () => void;
    logout: () => void;
    redirectLogin: (redirect: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : {children: React.ReactNode}) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [redirectUri, setRedirect] = useState<string | null>(null);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await fetchCheckToken();
                if (response.status === 200) {
                    const user = await fetchUser();
                    setUser(user);
                    return;
                }else {
                    setUser(null);
                    setIsAuth(false);
    
                    if (redirectUri)
                        router.push(redirectUri);
                }
            } catch {
                setUser(null);
                setIsAuth(false);
            }
        }

        const token  = Cookies.get("dragonkey");
        if (token) {
            setIsAuth(true);
            verifyUser();
        } else {
            setUser(null);
            setIsAuth(false);
        }
    }, []);


    if (isAuth === null) {
        return <div><Loader/></div>;
    }

    const login = async () => {
        setIsAuth(true);
        const user = await fetchUser();
        setUser(user);
    }

    const logout = () => {
        setIsAuth(false);
        Cookies.remove("dragonkey");
    }

    const redirectLogin = (redirect: string) => {
        setRedirect(redirect);
        if (redirectUri)
            router.push(redirectUri)
    }


    return (
        <AuthContext.Provider value={{ 
        user, 
        isAuth,
        login, 
        logout, 
        redirectLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}
