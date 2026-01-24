"use client"

import Backgraund from "@components/backgraund";
import Loader from "@components/Loader";
import { fetctTokenReset } from "@hooks/hookUser";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import style from "./reset_password.module.css";
import PasswordReset from "@components/Auth/PasswordReset";


export default function ResetPassword() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    const [check, setCheck] = useState<boolean | undefined>();
    Backgraund();

    const tokenCheck = async (token: string, email: string) => {
        const response = await fetctTokenReset({token, email});
        if (response.status !== 200) {
            console.log(response.data);
            return setCheck(false);
        }

        if (response.data) {
            return setCheck(true);
        }

        console.log(response.data);
        return setCheck(false);
    }

    useEffect(() => {
        if (token && email) {
            tokenCheck(token, email);
        } else {
            setCheck(false);
        }
           
    }, [token, email]);

    return (
        <>
            {check === undefined && (
                <Loader />
            )}

            {check === true && (
                 <div>
                    <PasswordReset token={token || ''}/>
                 </div>
            )}

            {check === false && (
                <div className="container">
                    <div className={style.ContentBox}>
                        <div className={style.BoxAlert}>
                            <div className={style.IconsBox}>
                                <svg className={style.ico} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                                    <linearGradient id="hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1" x1="7.534" x2="27.557" y1="7.534" y2="27.557" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#f44f5a"></stop><stop offset=".443" stopColor="#ee3d4a"></stop><stop offset="1" stopColor="#e52030"></stop></linearGradient><path fill="url(#hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1)" d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z"></path><linearGradient id="hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2" x1="27.373" x2="40.507" y1="27.373" y2="40.507" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#a8142e"></stop><stop offset=".179" stopColor="#ba1632"></stop><stop offset=".243" stopColor="#c21734"></stop></linearGradient><path fill="url(#hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2)" d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z"></path>
                                </svg>
                            </div>
                            <div className={style.title}>
                                <h1 className={style.TileBox}>Подверждение email</h1>
                                <p className={style.ContextBox}>Ваш email не удалось подвердить. Просьба сообщить в тех.поддрежку</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )



}