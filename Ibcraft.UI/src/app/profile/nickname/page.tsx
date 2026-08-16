"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PenLine } from "lucide-react";

import BubbleControler from "@components/EffectComponents/BubbleControler";
import Loader from "@components/Loader";
import { fetchUpdateNikname, fetchUser, needsMinecraftNickname } from "@hooks/hookUser";

import style from "../profile.module.css";

function NicknameForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [nickname, setNickname] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const returnUrl = searchParams.get("returnUrl") || "/profile";

    BubbleControler();

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await fetchUser();

            if (!currentUser) {
                router.replace("/auth");
                return;
            }

            if (!needsMinecraftNickname(currentUser)) {
                router.replace(returnUrl);
                return;
            }

            setIsLoading(false);
        };

        loadUser();
    }, [router, returnUrl]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextNickname = nickname.trim();

        if (!/^[A-Za-z0-9_]{3,16}$/.test(nextNickname)) {
            setMessage("Ник Minecraft: 3-16 символов, латиница, цифры и нижнее подчеркивание.");
            return;
        }

        setIsSaving(true);
        setMessage(null);

        const response = await fetchUpdateNikname({ newNikname: nextNickname });

        if (response.status === 200) {
            router.replace(returnUrl);
            return;
        }

        if (response.status === 409) {
            setMessage("Такой никнейм уже занят.");
        } else {
            setMessage(typeof response.data === "string" ? response.data : "Не получилось сохранить никнейм.");
        }

        setIsSaving(false);
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <main className={style.page}>
            <div className="container">
                <section className={style.nicknameShell}>
                    <span className={style.statusIcon}>
                        <PenLine size={30} />
                    </span>
                    <form className={style.modalForm} onSubmit={handleSubmit}>
                        <div>
                            <span className={style.kicker}>Minecraft никнейм</span>
                            <h1>Введите ваш никнейм</h1>
                            <p className={style.formHint}>
                                Он будет отображаться в профиле и в заявке на проходку. Без ника профиль и анкета закрыты.
                            </p>
                        </div>

                        <input
                            value={nickname}
                            type="text"
                            placeholder="Например: Dragofox"
                            autoFocus
                            onChange={(event) => setNickname(event.target.value)}
                        />

                        {message ? <p className={style.formMessage}>{message}</p> : null}

                        <button type="submit" className={style.primaryButton} disabled={isSaving}>
                            {isSaving ? "Сохраняю..." : "Сохранить никнейм"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}

export default function NicknamePage() {
    return (
        <Suspense fallback={<Loader />}>
            <NicknameForm />
        </Suspense>
    );
}
