
import Image from "next/image";
import lock from "@static/3d-lock.png"
import style from "./auth.module.css"
import { googleAuth } from "@hooks/hookUser";


function LoginBlock() {
    return (
        <>
            <div className={style.title_auth}>
                <Image className={style.lock_img} src={lock} alt="" />
                <h1 className={style.media_text}>Авторизация</h1>
            </div>
            <div className={style.buttons}>
                <div className={style.group_auth_btn}>
                    <button onClick={googleAuth}>
                        Вход через гугл
                    </button>
                    <button onClick={googleAuth}>
                        Вход через Дискорд
                    </button>
                    <button onClick={googleAuth}>
                        Вход через Телеграм
                    </button>
                </div>
            </div>
        </>
    )
}

export default LoginBlock;