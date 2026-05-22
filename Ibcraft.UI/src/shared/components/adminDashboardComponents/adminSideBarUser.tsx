"use client";

import { use, useEffect } from "react";
import { X } from "lucide-react";
import styles from "./UserSidebar.module.css";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    user: {
       username: string;
       createdAt: string;
       email: string;
       discord?: string;
       emailVerified: boolean;
       role: string;
    };
}

export default function AdminSideBarUser({isOpen, onClose, user}: Props) { 
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"; // Отключаем прокрутку
        } else {
            document.body.style.overflow = ""; // Включаем прокрутку
        }


    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.sidebar}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.section}>
                    <h2>Основные</h2>
                    <div className={styles.formGroup}>
                        <label>Ник игрока</label>
                        <input type="text" value={user.username} disabled/>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Дата создания</label>
                        <div className={styles.readonlyBox}>
                            {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input type="text" value={user.email} disabled/>
                        {user.emailVerified && (
                            <div className={styles.emailConfirmed}>Email подтвержден</div>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Дискорд игрока</label>
                        <input type="text" placeholder="Id пользователя" disabled />
                        <input type="text" placeholder="Тег пользователя" disabled value={user.discord} />
                    </div>
                    <button className={styles.applyBtn}>Применить</button>
                </div>

                <div className={styles.section_password}>
                    <h2>Обновление пароля</h2>
                    <div className={styles.formGroupRow}>
                        <input type="password" placeholder="Новый пароль" />
                        <input type="password" placeholder="Повтор пароля" />
                    </div>
                    <button className={styles.updateBtn}>Обновить</button>
                </div>
                <div className={styles.section}>
                    <h2>Роль пользователя</h2>
                    <div className={styles.formGroup}>
                        <label>Роль</label>
                        <select value={user.role} onChange={(e) => console.log("Role changed to:", e.target.value)}>
                            <option value="User">Пользователь</option>
                            <option value="Admin">Администратор</option>
                            <option value="Moderator">Модератор</option>
                        </select>
                    </div>
                   
                </div>
                
            </div>
        </div>
    );
}