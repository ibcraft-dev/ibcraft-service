"use client";

import { useEffect } from "react";
import style from "./auth.module.css"

interface AuthContainerProps {
    children: React.ReactNode;
}

function AuthContainer({children}: AuthContainerProps) {
    useEffect(() => {
        document.body.style.cssText = `
          backgraund: linear-gradient(162deg, rgba(151, 71, 255, 0.20) 0%, rgba(33, 11, 52, 0.20) 49.72%, rgba(135, 0, 255, 0.20) 98.15%), #210B34;
        `
      }, []);

    return (
        <main>
            <div className={style.main_auth}>
                <div className="container">
                    <div className={style.wrapper}>
                        <div className={style.blockauth}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AuthContainer;