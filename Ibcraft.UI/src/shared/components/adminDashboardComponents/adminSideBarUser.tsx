"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, KeyRound, Save, Shield, UserRound, X } from "lucide-react";
import {
    AdminManagedUser,
    updateAdminUser,
    updateAdminUserPassword,
} from "@hooks/hookAdmin";
import styles from "./UserSidebar.module.css";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    user: AdminManagedUser;
    onUserUpdate: (user: AdminManagedUser) => void;
};

export default function AdminSideBarUser({ isOpen, onClose, user, onUserUpdate }: Props) {
    const [nickname, setNickname] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [emailConfirmed, setEmailConfirmed] = useState(user.emailVerified);
    const [role, setRole] = useState(user.role);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isPasswordSaving, setIsPasswordSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    useEffect(() => {
        setNickname(user.username);
        setEmail(user.email);
        setEmailConfirmed(user.emailVerified);
        setRole(user.role);
        setPassword("");
        setConfirmPassword("");
        setMessage("");
        setPasswordMessage("");
    }, [user]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);
        setMessage("");

        const response = await updateAdminUser(user.id, {
            nickname,
            email,
            emailConfirmed,
            role,
        });

        if (response.data) {
            onUserUpdate(response.data);
            setMessage("Изменения сохранены.");
        } else {
            setMessage("Не удалось сохранить. Проверь API или права администратора.");
        }

        setIsSaving(false);
    };

    const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPasswordMessage("");

        if (!password || password !== confirmPassword) {
            setPasswordMessage("Пароли должны совпадать.");
            return;
        }

        setIsPasswordSaving(true);
        const response = await updateAdminUserPassword(user.id, password, confirmPassword);

        if (response.status >= 200 && response.status < 300) {
            setPassword("");
            setConfirmPassword("");
            setPasswordMessage("Пароль обновлен.");
        } else {
            setPasswordMessage("Не удалось обновить пароль.");
        }

        setIsPasswordSaving(false);
    };

    return (
        <div className={styles.overlay}>
            <aside className={styles.sidebar} aria-label="Редактирование пользователя">
                <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Закрыть">
                    <X size={22} />
                </button>

                <header className={styles.sidebarHeader}>
                    <span className={styles.avatar}>
                        {role.toLowerCase() === "admin" ? <Shield size={24} /> : <UserRound size={24} />}
                    </span>
                    <div>
                        <span className={styles.kicker}>Изменить пользователя</span>
                        <h2>{user.username}</h2>
                        <p>ID: {user.id}</p>
                    </div>
                </header>

                <form className={styles.section} onSubmit={handleSubmit}>
                    <div className={styles.sectionTitle}>
                        <CheckCircle2 size={20} />
                        <h3>Основные данные</h3>
                    </div>

                    <label className={styles.formGroup}>
                        <span>Ник игрока</span>
                        <input value={nickname} onChange={(event) => setNickname(event.target.value)} />
                    </label>

                    <label className={styles.formGroup}>
                        <span>Email</span>
                        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
                    </label>

                    <label className={styles.switchRow}>
                        <input
                            checked={emailConfirmed}
                            onChange={(event) => setEmailConfirmed(event.target.checked)}
                            type="checkbox"
                        />
                        <span>Email подтвержден</span>
                    </label>

                    <div className={styles.formGroup}>
                        <span>Дата создания</span>
                        <div className={styles.readonlyBox}>
                            {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                        </div>
                    </div>

                    <label className={styles.formGroup}>
                        <span>Роль</span>
                        <select value={role} onChange={(event) => setRole(event.target.value)}>
                            <option value="User">Пользователь</option>
                            <option value="Moderator">Модератор</option>
                            <option value="Admin">Администратор</option>
                        </select>
                    </label>

                    {message && <p className={styles.formMessage}>{message}</p>}

                    <button className={styles.applyBtn} type="submit" disabled={isSaving}>
                        <Save size={17} />
                        {isSaving ? "Сохранение..." : "Применить"}
                    </button>
                </form>

                <form className={styles.section} onSubmit={handlePasswordSubmit}>
                    <div className={styles.sectionTitle}>
                        <KeyRound size={20} />
                        <h3>Обновление пароля</h3>
                    </div>

                    <div className={styles.passwordGrid}>
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            type="password"
                            placeholder="Новый пароль"
                        />
                        <input
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            type="password"
                            placeholder="Повтор пароля"
                        />
                    </div>

                    {passwordMessage && <p className={styles.formMessage}>{passwordMessage}</p>}

                    <button className={styles.applyBtn} type="submit" disabled={isPasswordSaving}>
                        <KeyRound size={17} />
                        {isPasswordSaving ? "Обновление..." : "Обновить"}
                    </button>
                </form>
            </aside>
        </div>
    );
}
