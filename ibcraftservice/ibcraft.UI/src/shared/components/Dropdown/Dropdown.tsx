"use client";

import { useEffect, useRef, useState } from "react";
import style from "./dropdown.module.css";

interface DropdownProps {
    children: React.ReactNode;
    icon?: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

export default function Dropdown({children, icon, onToggle, isOpen}: DropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
         const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if (isOpen) onToggle(); // Закрываем при клике вне, если открыт
            }
        };

        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const menu = dropdownRef.current.querySelector(`.${style.dropdownContent}`) as HTMLElement;
            if (menu) {
            const rect = menu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                // сдвигаем влево на переполнение
                menu.style.left = `auto`;
                menu.style.right = `0`;
            }
            }
        }
    }, [isOpen]);

    return (
        
        <div ref={dropdownRef} className={style.dropdown}>
            <a id="dropbtn" className={style.dropbtn} onClick={onToggle}>
                <span className={style.icon_down}>
                   {icon ? icon :  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>}
                </span>
            </a>
            <div id="dropdown-content" className={`${style.dropdownContent} ${isOpen ? style.show : ''}`}>
                {children}
            </div>
        </div>

    )
}