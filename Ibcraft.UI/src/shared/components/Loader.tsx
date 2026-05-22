"use client"

import { useEffect } from "react"

import style from "./Loader.module.css"

type LoaderProps = {
    compact?: boolean;
};

export default function Loader({ compact = false }: LoaderProps) {

    useEffect(() => {
        document.body.style.background = "#13061E";
    }, [])

    return (
        
           <div className={`${style.container} ${compact ? style.compact : ""}`}>
                <div className={style.loader}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
           </div>

    )
}
