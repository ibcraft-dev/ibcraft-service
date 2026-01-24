"use client"

import { useEffect } from "react"

import style from "./Loader.module.css"

export default function Loader() {

    useEffect(() => {
        document.body.style.background = "#13061E";
    }, [])

    return (
        
           <div className={style.container}>
                <div className={style.loader}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
           </div>

    )
}