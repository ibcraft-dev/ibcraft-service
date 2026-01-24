"use client"
import Backgraund from "@components/backgraund";
import Loader from "@components/Loader";
import { fetchConfirmUser } from "@hooks/hookUser";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import style from "./confirm.module.css"

export default function ConfirmEmail() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const [confirm, setConfirm] = useState<boolean | undefined>(undefined);
    Backgraund();

    useEffect(() => {;
        if (token && email) {
            confirmEmailHandler(token, email);
        };
        setConfirm(false);
    }, [token, email]);

    const confirmEmailHandler = async (token: string, email: string) => {
        const response = await fetchConfirmUser({token, email});
        if (response.status !== 200) {
            return setConfirm(false);
        }

        return setConfirm(true);
    }

    return (
       <>
        {confirm === undefined && (
            <Loader />
        )}

        {confirm === true && (
           <div className="container">
               <div className={style.ContentBox}>
                    <div className={style.BoxAlert}>
                        <div className={style.IconsBox}>
                            <svg className={style.ico} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                <linearGradient id="HoiJCu43QtshzIrYCxOfCa_VFaz7MkjAiu0_gr1" x1="21.241" x2="3.541" y1="39.241" y2="21.541" gradientUnits="userSpaceOnUse"><stop offset=".108" stop-color="#0d7044"></stop><stop offset=".433" stop-color="#11945a"></stop></linearGradient><path fill="url(#HoiJCu43QtshzIrYCxOfCa_VFaz7MkjAiu0_gr1)" d="M16.599,41.42L1.58,26.401c-0.774-0.774-0.774-2.028,0-2.802l4.019-4.019	c0.774-0.774,2.028-0.774,2.802,0L23.42,34.599c0.774,0.774,0.774,2.028,0,2.802l-4.019,4.019	C18.627,42.193,17.373,42.193,16.599,41.42z"></path><linearGradient id="HoiJCu43QtshzIrYCxOfCb_VFaz7MkjAiu0_gr2" x1="-15.77" x2="26.403" y1="43.228" y2="43.228" gradientTransform="rotate(134.999 21.287 38.873)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2ac782"></stop><stop offset="1" stop-color="#21b876"></stop></linearGradient><path fill="url(#HoiJCu43QtshzIrYCxOfCb_VFaz7MkjAiu0_gr2)" d="M12.58,34.599L39.599,7.58c0.774-0.774,2.028-0.774,2.802,0l4.019,4.019	c0.774,0.774,0.774,2.028,0,2.802L19.401,41.42c-0.774,0.774-2.028,0.774-2.802,0l-4.019-4.019	C11.807,36.627,11.807,35.373,12.58,34.599z"></path>
                            </svg>
                        </div>
                        <div className={style.title}>
                            <h1 className={style.TileBox}>Подверждение email</h1>
                            <p className={style.ContextBox}>Ваш email успешно подвержден. Теперь вы можите авторизироваться на свой аккаунт.</p>
                        </div>
                    </div>
               </div>
           </div>
        )}

        {confirm === false && (
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