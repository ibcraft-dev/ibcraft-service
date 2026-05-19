"use client"

import { useEffect, useState } from "react";
import style from "./adminSideNav.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";


export default function AdminSideNav() {
   const [closeBar, setCloseBar] = useState(false);
   const pathname = usePathname();

   useEffect(() => {
    const savedState = localStorage.getItem('sidebarClosed');
    if (savedState !== null) {
        setCloseBar(savedState === "false")
    }
   }, [])

   useEffect(() => {
    localStorage.setItem('sidebarClosed', closeBar.toString());
   }, [closeBar])

   var handleClick = () => {
         const sidebar = document.getElementById("sidebar");
         const chevron = document.getElementById("chevron");
         if (sidebar) {
              chevron?.classList.toggle(style.active_chevron)
              setCloseBar(!closeBar);
         }
   }

   return <>
        <nav className={`${style.sidebar} ${closeBar ? style.closed: ""}`} id="sidebar">
            <header className={style.header}>
                <div className={style.image_text}>
                    <span className={style.image}>
                        <img src="/logo_new.jpg" alt="logo" />
                    </span>
                    <div className={` ${style.header_text} ${style.text} `}>
                        <span className={style.name}>IbCraft</span>
                        <span className={style.profession}> Admin Deshboard</span>
                    </div>
                </div>

                <i className={`bx bx-chevron-right ${style.toggle}`} onClick={handleClick} id="chevron"></i>
            </header>

            <div className={style.menu_bar}>
                <div className={style.menu}>
                    <ul className={`${style.nav_links}`}>
                        <li className={`${style.nav_link} ${pathname === "/admin/home" ? style.active : ""}`}>
                            <Link href="/admin/home">
                                <i className={`bx bx-home-alt ${style.icon}`} ></i>
                                <span className={`${style.text} ${style.nav_text}`}>Главная</span>
                            </Link>
                        </li>
                    </ul>
                    <ul className={style.nav_links}>
                        <li className={`${style.nav_link} ${pathname === "/admin/user" ? style.active : ""}`}>
                            <Link href="/admin/user">
                                <i className={`bx bx-user ${style.icon}`} ></i>
                                <span className={`${style.text} ${style.nav_text}`}>Пользователи</span>
                            </Link>
                        </li>
                    </ul>
                    <ul className={style.nav_links}>
                        <li className={`${style.nav_link} ${pathname === "/admin/notifications" ? style.active : ""}`}>
                            <Link href="/admin/notifications">
                                <i className={`bx bx-bell ${style.icon}`} ></i>
                                <span className={`${style.text} ${style.nav_text}`}>Оповещение</span>
                            </Link>
                        </li>
                    </ul>
                    <ul className={style.nav_links}>
                        <li className={`${style.nav_link} ${pathname === "/admin/request" ? style.active : ""}`}>
                            <Link href="/admin/request">
                                <i className={`bx bx-notepad ${style.icon}`} ></i>
                                <span className={`${style.text} ${style.nav_text}`}>Заявки на проходку</span>
                            </Link>
                        </li>
                    </ul>
                    <ul className={`${style.subnav} ${pathname === "/admin/request" ? style.subnav_active : ""}`}>
                                <li className={style.subitems}>
                                    <a href="#all" className={style.sublink}>
                                        <i className={`bx bxs-archive ${style.icon}`}></i>
                                        <span className={`${style.text} ${style.nav_text}`}>Все заявки</span>
                                    </a>
                                </li>
                                <li className={style.subitems}>
                                    <a href="#new" className={style.sublink}>
                                        <i className={`bx bxs-archive ${style.icon}`}></i>
                                        <span className={`${style.text} ${style.nav_text}`}>Новые заявки</span>
                                    </a>
                                </li>
                                <li className={style.subitems}>
                                    <a href="#approved" className={style.sublink}>
                                        <i className={`bx bx-list-check ${style.icon}`} ></i>
                                        <span className={`${style.text} ${style.nav_text}`}>Одобренные</span>
                                    </a>
                                </li>
                                <li className={style.subitems}>
                                    <a href="#rejected" className={style.sublink}>
                                        <i className={`bx bx-user-x ${style.icon}`} ></i>
                                        <span className={`${style.text} ${style.nav_text}`}>Отклонённые</span>
                                    </a>
                                </li>
                    </ul>
                    <ul className={style.nav_links}>
                        <li className={`${style.nav_link} ${pathname === "/admin/settings" ? style.active : ""}`}>
                            <Link href="/admin/settings">
                                <i className={`bx bx-cog ${style.icon}`} ></i>
                                <span className={`${style.text} ${style.nav_text}`}>Настрйки</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={style.bottom_content}>
                    <li className={style.nav_links}>
                        <a href="#">
                            <i className={`bx bx-log-out ${style.icon}`} ></i>
                            <span className={`${style.text} ${style.nav_text}`}>Выйти</span>
                        </a>
                    </li>
                    <li className={style.nav_links}>
                        <Link href="/">
                            <i className={`bx bx-home ${style.icon}`} ></i>
                            <span className={`${style.text} ${style.nav_text}`}>Главная страница</span>
                        </Link>
                    </li>
                </div>
            </div>
        </nav>
   </>
}