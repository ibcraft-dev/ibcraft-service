"use client";

import { useState } from "react";
import style from "./mainblock.module.css";
import Link from "next/link";
import Image from "next/image";
import OptionsButton from "../../Buttons/OptionsButton";
import ClipAlert from "../../alert/clipAlert";
import dragofox from "@static/one_block-2.svg";
import user_ico from "@static/user_ico.svg";
import download_ico from "@static/download_ico.svg";

function MainBlock() {
    const [copySuccess, setCopySuccess] = useState(false);

    const textIp = 'mc.ibcraft.ru';

    const hadleCopyClick = () => {
        navigator.clipboard.writeText(textIp)
            .then(() => {
                console.log("Text copied to clipboard!");
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            })
            .catch((error) => {
                console.error('Error copying text: ', error);
            });
    };

    return (

        <div className={style.main}>
            <section>
                <div className={style.dragofox}>
                    <Image src={dragofox} alt="Dragon" width={380} height={380} />
                </div>
            </section>
            <div className="container">
                <ClipAlert copySuccess={copySuccess}>
                    ✅ Скопировано!
                </ClipAlert>
                <div className={style.wrapper}>
                    <div className={style.discription_block}>
                        <p className={style.discription_context}>
                            Ванильный <span>полу-РП сервер</span> Minecraft на версии
                            1.21 для любителей классического выживания с парочкой небольших плагинов
                        </p>
                    </div>
                    <div className={style.options_block}>

                        <OptionsButton onClick={hadleCopyClick} disabled={false} loading={false} icon={""} href="#" className={style.ip_btn}>
                            <span className={style.icon_option}>
                                <svg width="21px" height="21px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z" /><path d="M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192A128 128 0 0 1 384 64z" />
                                </svg>
                            </span>
                            Скопировать IP
                        </OptionsButton>
                        <ul className={style.option_button_items}>
                            <li className={style.item_main_btn}>
                                <Link href="/telegram_bot" className={style.main_btn}>Получить проходку<Image src={user_ico} width={24} height={21} alt="user_ico" /></Link>
                            </li>
                            <li className={style.item_main_btn}>
                                <Link href="/modpack" className={style.main_btn}>Скачать сборку<Image src={download_ico} width={24} height={21} alt="download_ico" /></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default MainBlock;
