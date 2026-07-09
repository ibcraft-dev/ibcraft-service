"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@components/Loader";
import { fetchAdminLogin, fetchAdminMe } from "@hooks/hookAdmin";
import { discordAuth, googleAuth } from "@hooks/hookUser";
import style from "./adminLogin.module.css";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const telegramWidgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.style.background = "#13061E";

        const checkAdmin = async () => {
            const response = await fetchAdminMe();

            if (response.status === 200) {
                router.replace("/admin/home");
                return;
            }

            setIsLoading(false);
        };

        checkAdmin();
    }, [router]);

    useEffect(() => {
        const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

        if (!telegramWidgetRef.current || !botUsername || isLoading) {
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL_HTTP ?? "";
        const normalizedApiUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
        const returnUrl = encodeURIComponent(window.location.origin + "/admin/home");
        const authBaseUrl = normalizedApiUrl || window.location.origin;
        const authUrl = authBaseUrl + "/api/auth/telegram/callback?returnUrl=" + returnUrl;

        telegramWidgetRef.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", botUsername);
        script.setAttribute("data-size", "large");
        script.setAttribute("data-radius", "8");
        script.setAttribute("data-userpic", "false");
        script.setAttribute("data-auth-url", authUrl);
        script.setAttribute("data-request-access", "write");

        telegramWidgetRef.current.appendChild(script);
    }, [isLoading]);

    const getAdminReturnUrl = () => window.location.origin + "/admin/home";

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);
        setIsSubmitting(true);

        const response = await fetchAdminLogin({ email, password });

        if (response.status === 200) {
            router.replace("/admin/home");
            return;
        }

        if (response.status === 403) {
            setMessage("У этого аккаунта нет прав администратора или модератора.");
        } else {
            setMessage("Неверный email или пароль.");
        }

        setIsSubmitting(false);
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <main className={style.page}>
            <section className={style.panel}>
                <div className={style.header}>
                    <span>IB-Craft Admin</span>
                    <h1>Вход в админку</h1>
                </div>

                <form className={style.form} onSubmit={handleSubmit}>
                    <div className={style.field}>
                        <label htmlFor="admin-email">Email</label>
                        <input
                            id="admin-email"
                            type="email"
                            value={email}
                            autoComplete="email"
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className={style.field}>
                        <label htmlFor="admin-password">Пароль</label>
                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            autoComplete="current-password"
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    {message ? <p className={style.message}>{message}</p> : null}

                    <button className={style.button} type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Проверяю..." : "Войти"}
                    </button>
                </form>

                <div className={style.oauthBlock}>
                    <span>Войти через сервис</span>
                    <button type="button" className={style.oauthButton} onClick={() => googleAuth(getAdminReturnUrl())}>
                        Google
                    </button>
                    <button type="button" className={style.oauthButton} onClick={() => discordAuth(getAdminReturnUrl())}>
                        Discord
                    </button>
                    <div className={style.telegramWidget} ref={telegramWidgetRef} />
                </div>
            </section>
        </main>
    );
}
