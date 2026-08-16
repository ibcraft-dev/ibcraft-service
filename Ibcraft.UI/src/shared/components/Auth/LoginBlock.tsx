"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import lock from "@static/3d-lock.png";
import style from "./auth.module.css";
import { discordAuth, googleAuth } from "@hooks/hookUser";

function LoginBlock() {
    const telegramWidgetRef = useRef<HTMLDivElement>(null);
    const getNicknameReturnUrl = () => window.location.origin + "/profile/nickname?returnUrl=" + encodeURIComponent("/profile");

    useEffect(() => {
        const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

        if (!telegramWidgetRef.current || !botUsername) {
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL_HTTP ?? "";
        const normalizedApiUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
        const returnUrl = encodeURIComponent(getNicknameReturnUrl());
        const authBaseUrl = normalizedApiUrl || window.location.origin;
        const authUrl = authBaseUrl + "/api/auth/telegram/callback?returnUrl=" + returnUrl;

        telegramWidgetRef.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", botUsername);
        script.setAttribute("data-size", "large");
        script.setAttribute("data-radius", "20");
        script.setAttribute("data-userpic", "false");
        script.setAttribute("data-auth-url", authUrl);
        script.setAttribute("data-request-access", "write");

        telegramWidgetRef.current.appendChild(script);
    }, []);

    return (
        <>
            <div className={style.title_auth}>
                <Image className={style.lock_img} src={lock} alt="" />
                <h1 className={style.media_text}>Авторизация</h1>
            </div>
            <div className={style.buttons}>
                <div className={style.group_auth_btn}>
                    <button onClick={() => googleAuth(getNicknameReturnUrl())} className={style.button}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style={{ width: "30px", fill: "white" }}>
                            <path d="M564 325.8C564 467.3 467.1 568 324 568C186.8 568 76 457.2 76 320C76 182.8 186.8 72 324 72C390.8 72 447 96.5 490.3 136.9L422.8 201.8C334.5 116.6 170.3 180.6 170.3 320C170.3 406.5 239.4 476.6 324 476.6C422.2 476.6 459 406.2 464.8 369.7L324 369.7L324 284.4L560.1 284.4C562.4 297.1 564 309.3 564 325.8z" />
                        </svg>
                        Вход через Google
                    </button>
                    <button onClick={() => discordAuth(getNicknameReturnUrl())} className={style.button}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style={{ width: "30px", fill: "white" }}>
                            <path d="M524.5 133.8C485.6 115.6 445.3 103.1 404 96C396.6 106.8 391.6 117.1 387.2 127.5C342.6 120.7 297.3 120.7 252.8 127.5C248.3 117 243.3 106.8 237.7 96.9C194.5 103 154.2 115.5 116.1 133C39.1 247.5 18.2 358.6 28.4 468.2C73.5 502.5 123.1 527.6 175.9 543.8C189.2 527.7 199.3 511.3 207.9 494.3C191.1 485.6 175.7 478.3 161 469.8C163.9 464.4 167 462 169.9 459.6C268 503.2 372.2 503.2 467.3 459.3C472.1 461.9 475.2 464.4 478.3 466.7C463.5 478.4 448.2 485.7 432.3 491.6C440.1 511.3 450.1 527.6 461.3 543.1C516.2 527.6 565.9 502.5 610.4 469.6C623.4 341.4 590.6 231.3 524.5 133.8ZM222.5 401.5C193.5 401.5 169.7 374.9 169.7 342.3C169.7 309.7 193.1 283.1 222.5 283.1C252.2 283.1 275.8 309.9 275.3 342.3C275.3 375 251.9 401.5 222.5 401.5ZM417.9 401.5C388.9 401.5 365.1 374.9 365.1 342.3C365.1 309.7 388.5 283.1 417.9 283.1C447.6 283.1 471.2 309.9 470.7 342.3C470.7 375 447.5 401.5 417.9 401.5Z" />
                        </svg>
                        Вход через Discord
                    </button>
                    <div className={style.telegram_widget} ref={telegramWidgetRef} />
                </div>
            </div>
        </>
    );
}

export default LoginBlock;
