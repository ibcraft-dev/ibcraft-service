"use client";

import style from "./auth.module.css";
import Image from "next/image";
import lock from "@static/3d-lock.png"
import { useState } from "react";
import SubmitButton from "../Buttons/SubmitButton";
import { useAlert } from "../alert/alertContext";
import { fetchResetPassword } from "@hooks/hookUser";
import { useRouter } from "next/navigation";

interface PasswordResetProps {
    token: string;
}

export default function PasswordReset({ token }: PasswordResetProps) {

    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const { setAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const navigate = useRouter();
    

    const handleSubmit = async () => {
        if (password !== passwordConfirm) {
            setAlert("Пароли не совпадают", "red");
            return;
        }

        setLoading(true);

        const response = await fetchResetPassword({ token, newPassword: password, confirmPassword: passwordConfirm });
        if (response.status === 200) {
            setAlert("Пароль успешно изменен", "green");
            navigate.push("/auth/login");
            return;
        }

        if (response.status === 400) {
            setAlert("Ошибка валидации", "red");
            setLoading(false);
            return;
        }
    }

    return (
       <div className="container">
           <div className={style.wrapper}>
            <div className={style.blockauth}>
                <div className={style.title_auth}>
                        <Image className={style.lock_img} src={lock} alt="" />
                        <h1 className={style.media_text}>Смена пароля</h1>
                    </div>
                    <form className={style.forms} onSubmit={handleSubmit}>
                        <div className={style.from_auth}>
                            <input type="password" name="password" id="password" className={style.from_auth} placeholder="Пароль"  onChange={(e) => {setPassword(e.target.value)}} />    
                        </div>
                        <div className={style.from_auth}>
                        <input type="password" name="passwordConfirm" id="passwordConfirm" className={style.from_auth} placeholder="Подтвердите пароль" onChange={(e) => {setPasswordConfirm(e.target.value)}} />
                        </div>
                        <div className={style.group_auth_btn}>
                            <SubmitButton onClick={handleSubmit} 
                                        disabled={loading} 
                                        loading={false} 
                                        icon={""} > Восстановить
                            </SubmitButton>
                        </div>
                    </form>
                </div>
           </div>
       </div>
    )
}