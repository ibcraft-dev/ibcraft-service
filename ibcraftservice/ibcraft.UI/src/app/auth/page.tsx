"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@components/Loader";

export default function AuthPage() {
    const navigate = useRouter();
    useEffect(() => {
        document.body.style.cssText = `
          backgraund: linear-gradient(162deg, rgba(151, 71, 255, 0.20) 0%, rgba(33, 11, 52, 0.20) 49.72%, rgba(135, 0, 255, 0.20) 98.15%), #210B34;
        `
        navigate.push("/auth/login");
      }, [navigate]);
    
    return (
        <><Loader /></>
    )
}