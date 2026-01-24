"use client";

import style from "./auth.module.css";
import Image from "next/image";
import lock from "@static/3d-lock.png"
import Link from "next/link";
import { useState } from "react";
import SubmitButton from "../Buttons/SubmitButton";
import { useAlert } from "../alert/alertContext";
import { fetchForgotPassword } from "@hooks/hookUser";


export default function PasswordForgotBlock() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { setAlert } = useAlert();
    

    const handleSubmit = async () => {
        setLoading(true);

        if (!email) {
            setLoading(false);
            setAlert("Введите email", "red");
            return;
        }

        const post = await fetchForgotPassword({ email });

        if (post.status !== 200){
            setLoading(false);
            setAlert("Пользователь с таким email не найден", "red");
            return;
        }

        setAlert("На вашу почту отправлено письмо с инструкцией по восстановлению пароля", "green");

        console.log(email);
        setLoading(false);
    }


    return (
        <div>
            <div className={style.AuthBox}>
                <div className={style.title_auth}>
                    <Image className={style.lock_img} src={lock} alt="" />
                    <h1 className={style.media_text}>Восстановление пароля</h1>
                </div>
                <div className={style.AuthBoxForm}>
                    <form className={style.forms} onSubmit={handleSubmit}>
                        <div className={style.from_auth}>
                            <input type="email" name="email" id="email" className={style.from_auth} placeholder="Email"  onChange={(e) => {setEmail(e.target.value)}} />
                        </div>
                        <div className={style.group_auth_btn}>
                            <SubmitButton onClick={handleSubmit} 
                                         disabled={loading} 
                                         loading={false} 
                                         icon={""} > Восстановить
                            </SubmitButton>
                        </div>
                        <div className={style.support_group}>
                            <Link href="/auth/register" className={style.support_btn}>Зарегистрироваться</Link>
                            <Link href="/auth/login" className={style.support_btn}>Вход</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}