"use client";

import { useEffect, useState } from "react"

import style from "./header.module.css"
import logo from "@static/logo.svg"
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../Auth/AuthContext";
import icouser from "@static/GkSrQGFXUAA0Ar_.png"
import Cookies from 'js-cookie';


function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuth, logout } = useAuth();
    const hidden = Cookies.get('hidden') === 'true' ? true : false;

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen])

    return (
        <header className={`${style.header} ${style.fixed}`}>
            <canvas className={`${style.blur} ${isOpen ? style.blur_active : ""}`} onClick={toggleMenu}></canvas>
            <div className="container">
                <div className={style.header__row}>

                    <div className={style.logo}>
                        <Link href="/" className={style.header_logo_link}>
                            <Image src={logo} className={style.header__logo} alt="logo" />
                        </Link>
                    </div>
                    <div className={`${style.burger_menu} ${isOpen ? style.active : ""}`} onClick={toggleMenu}>
                        <span />
                        <span />
                        <span />
                    </div>
                    <nav className={`${style.navbar} ${isOpen ? style.open : ""}`}>
                        <ul className={style.navbar_items}>
                            <li className={style.list_nav}>
                                <Link href="/how-play" className={style.nav_btn}>
                                    <p>Как начать играть</p>
                                    <span className={style.btn_ico}>
                                        <svg width="19px" height="17px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.5 5.5C5.5 4.11929 6.61929 3 8 3C9.38071 3 10.5 4.11929 10.5 5.5C10.5 6.88071 9.38071 8 8 8H7V11H8C11.0376 11 13.5 8.53757 13.5 5.5C13.5 2.46243 11.0376 0 8 0C4.96243 0 2.5 2.46243 2.5 5.5H5.5Z" fill="#fff" />
                                            <path d="M10 13H7V16H10V13Z" fill="#fff" />
                                        </svg>
                                    </span>
                                </Link>
                            </li>
                            <li className={style.list_nav}>
                                <Link href="/rule" className={style.nav_btn}>
                                    <p>Правила</p>
                                    <span id={style.rules_ico} className={style.btn_ico}></span>
                                </Link>
                            </li>
                            {hidden ? null :
                                <li className={style.list_nav}>
                                {isAuth ? <>
                                    <div className={style.dropdown_content}>
                                        <Link href="/profile" className={`${style.user_btn} ${style.flex}`}>
                                            {user?.avatarIco ? <><img src={process.env.NEXT_PUBLIC_SERVER_URL_HTTP + user.avatarIco} alt="user" className={style.userIco} /></> :
                                                <>
                                                    <Image src={icouser} alt="user" className={style.userIco} />
                                                </>}
                                        </Link>
                                        <div className={style.header_dropdown}>
                                            <p className={style.username}>{user?.name}</p>
                                            <Link href="/profile">Профиль</Link>
                                            <a href="" onClick={logout}>Выход</a>
                                        </div>
                                    </div>
                                </> :
                                    <Link href="/auth" className={`${style.nav_btn} ${style.isDisabled}`}>
                                        <p className={style.login}>Авторизация</p>
                                        <span id={style.login} className={style.btn_ico}></span>
                                    </Link>
                                }
                            </li>}
                            <ul className={style.social_btn}>
                                <li className={style.list_nav}>
                                    <a href="/vk" className={style.nav_btn_mini}>
                                        <span className={style.btn_ico}>
                                            <svg width="21" height="21" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.97609 1.97609C0.5 3.45228 0.5 5.82837 0.5 10.58V11.42C0.5 16.1717 0.5 18.5478 1.97609 20.0239C3.45228 21.5 5.82837 21.5 10.58 21.5H11.42C16.1717 21.5 18.5478 21.5 20.0239 20.0239C21.5 18.5478 21.5 16.1717 21.5 11.42V10.58C21.5 5.82833 21.5 3.45223 20.0239 1.97609C18.5478 0.5 16.1717 0.5 11.42 0.5H10.58C5.82833 0.5 3.45223 0.5 1.97609 1.97609ZM4.04375 6.88756H6.44127C6.52002 10.895 8.28748 12.5925 9.6875 12.9425V6.88752H11.945V10.3438C13.3275 10.195 14.78 8.62002 15.27 6.88752H17.5275C17.3428 7.78602 16.9747 8.63676 16.4463 9.38653C15.9178 10.1363 15.2403 10.769 14.4562 11.245C15.3317 11.6796 16.105 12.2952 16.7249 13.0508C17.3449 13.8065 17.7974 14.6852 18.0525 15.6288H15.5675C15.3385 14.8092 14.8726 14.0755 14.2281 13.5197C13.5836 12.964 12.7894 12.611 11.945 12.505V15.6288H11.6737C6.88752 15.6288 4.15752 12.3475 4.04375 6.88752V6.88756Z" fill="white" />
                                            </svg>
                                        </span>
                                    </a>
                                </li>
                                <li className={style.list_nav}>
                                    <a href="/telegram" className={style.nav_btn_mini}>
                                        <span className={style.btn_ico}>
                                            <svg width="21px" height="21px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M23.1117 4.49449C23.4296 2.94472 21.9074 1.65683 20.4317 2.227L2.3425 9.21601C0.694517 9.85273 0.621087 12.1572 2.22518 12.8975L6.1645 14.7157L8.03849 21.2746C8.13583 21.6153 8.40618 21.8791 8.74917 21.968C9.09216 22.0568 9.45658 21.9576 9.70712 21.707L12.5938 18.8203L16.6375 21.8531C17.8113 22.7334 19.5019 22.0922 19.7967 20.6549L23.1117 4.49449ZM3.0633 11.0816L21.1525 4.0926L17.8375 20.2531L13.1 16.6999C12.7019 16.4013 12.1448 16.4409 11.7929 16.7928L10.5565 18.0292L10.928 15.9861L18.2071 8.70703C18.5614 8.35278 18.5988 7.79106 18.2947 7.39293C17.9906 6.99479 17.4389 6.88312 17.0039 7.13168L6.95124 12.876L3.0633 11.0816ZM8.17695 14.4791L8.78333 16.6015L9.01614 15.321C9.05253 15.1209 9.14908 14.9366 9.29291 14.7928L11.5128 12.573L8.17695 14.4791Z" fill="white" />
                                            </svg>
                                        </span>
                                    </a>
                                </li>
                                <li className={style.list_nav}>
                                    <Link href="/discord" className={style.nav_btn_mini}>
                                        <span className={style.btn_ico}>
                                            <svg width="21px" height="21px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18.59 5.88997C17.36 5.31997 16.05 4.89997 14.67 4.65997C14.5 4.95997 14.3 5.36997 14.17 5.69997C12.71 5.47997 11.26 5.47997 9.83001 5.69997C9.69001 5.36997 9.49001 4.95997 9.32001 4.65997C7.94001 4.89997 6.63001 5.31997 5.40001 5.88997C2.92001 9.62997 2.25001 13.28 2.58001 16.87C4.23001 18.1 5.82001 18.84 7.39001 19.33C7.78001 18.8 8.12001 18.23 8.42001 17.64C7.85001 17.43 7.31001 17.16 6.80001 16.85C6.94001 16.75 7.07001 16.64 7.20001 16.54C10.33 18 13.72 18 16.81 16.54C16.94 16.65 17.07 16.75 17.21 16.85C16.7 17.16 16.15 17.42 15.59 17.64C15.89 18.23 16.23 18.8 16.62 19.33C18.19 18.84 19.79 18.1 21.43 16.87C21.82 12.7 20.76 9.08997 18.61 5.88997H18.59ZM8.84001 14.67C7.90001 14.67 7.13001 13.8 7.13001 12.73C7.13001 11.66 7.88001 10.79 8.84001 10.79C9.80001 10.79 10.56 11.66 10.55 12.73C10.55 13.79 9.80001 14.67 8.84001 14.67ZM15.15 14.67C14.21 14.67 13.44 13.8 13.44 12.73C13.44 11.66 14.19 10.79 15.15 10.79C16.11 10.79 16.87 11.66 16.86 12.73C16.86 13.79 16.11 14.67 15.15 14.67Z" fill="#fff" />
                                            </svg>
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                        </ul>
                    </nav>

                </div>
            </div>
        </header>
    )


}

export default Header;
