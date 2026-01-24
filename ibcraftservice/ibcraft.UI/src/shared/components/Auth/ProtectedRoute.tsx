"use client"

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import Loader from "../Loader";


export default function ProtectedRoute({ children }: { children: ReactNode}) {
   ;
    const pathname = usePathname();
    const router = useRouter();
    const { isAuth } = useAuth();
    useEffect(() => { 
      if (!isAuth) {
        router.push(`/auth/login?redirect=${pathname}`);
      } 
      }, [isAuth, router, pathname]);

      if (isAuth === null) return <div><Loader/></div>;

      return (
        <>
          {isAuth ? children : <div><Loader/></div>}
        </>
      )
}