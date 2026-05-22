"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@components/Loader";
import { fetchAdminLogin, fetchAdminMe } from "@hooks/hookAdmin";
import style from "./adminLogin.module.css";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            setMessage("У этого аккаунта нет прав администратора.");
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
            </section>
        </main>
    );
}
