"use client";

import { ChangeEvent, FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, Clock3, LogOut, PenLine, ShieldAlert, UserRound, XCircle } from "lucide-react";

import BubbleControler from "@components/EffectComponents/BubbleControler";
import Loader from "@components/Loader";
import Modal from "@components/Modal";
import { fetchLogout, fetchUpdateNikname, fetchUpdateUserAvatar, fetchUser } from "@hooks/hookUser";
import { User } from "@hooks/IUser";
import { useStatus } from "@hooks/useStatus";
import icouser from "@static/GkSrQGFXUAA0Ar_.png";

import style from "./profile.module.css";

type ProfileStatus = {
    title: string;
    text: string;
    tone: string;
    icon: ReactNode;
    canApply: boolean;
};

function getProfileStatus(status: string | null): ProfileStatus {
    switch (status) {
        case "Approved":
            return {
                title: "Заявка одобрена",
                text: "Доступ к серверу открыт. Можно заходить и играть.",
                tone: style.approved,
                icon: <CheckCircle2 size={28} />,
                canApply: false,
            };
        case "Pending":
            return {
                title: "Заявка на рассмотрении",
                text: "Администрация уже получила анкету. Обычно это занимает немного времени.",
                tone: style.pending,
                icon: <Clock3 size={28} />,
                canApply: false,
            };
        case "Reject":
            return {
                title: "Заявка отклонена",
                text: "Можно уточнить причину и попробовать подать заявку позже.",
                tone: style.rejected,
                icon: <XCircle size={28} />,
                canApply: false,
            };
        case "error":
            return {
                title: "Статус недоступен",
                text: "Не удалось получить статус заявки. Попробуйте обновить страницу.",
                tone: style.rejected,
                icon: <ShieldAlert size={28} />,
                canApply: false,
            };
        case "Unfiled":
        case null:
        default:
            return {
                title: "Заявка не подана",
                text: "Заполните короткую анкету, чтобы получить проходку на сервер.",
                tone: style.unfiled,
                icon: <UserRound size={28} />,
                canApply: true,
            };
    }
}

function Profile({ user, onUserChange }: { user: User; onUserChange: (user: User | null) => void }) {
    const router = useRouter();
    const status = useStatus(user.id ?? "");
    const profileStatus = useMemo(() => getProfileStatus(status), [status]);
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [nickname, setNickname] = useState(user.name ?? "");
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const avatarSrc = user.avatarIco
        ? `${process.env.NEXT_PUBLIC_SERVER_URL_HTTP}${user.avatarIco}`
        : null;

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const refreshUser = async () => {
        const freshUser = await fetchUser();
        onUserChange(freshUser);
    };

    const handleLogout = async () => {
        await fetchLogout();
        onUserChange(null);
        router.replace("/auth");
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] ?? null;
        setFile(selectedFile);
        setMessage(null);

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
    };

    const handleAvatarUpload = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) {
            setMessage("Выберите изображение для загрузки.");
            return;
        }

        setIsSaving(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetchUpdateUserAvatar({ file: formData });

        if (response.status === 200) {
            await refreshUser();
            setIsAvatarModalOpen(false);
            setFile(null);
            setPreview(null);
        } else {
            setMessage("Не получилось обновить аватар.");
        }

        setIsSaving(false);
    };

    const handleNicknameUpdate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextNickname = nickname.trim();

        if (!nextNickname) {
            setMessage("Введите новый никнейм.");
            return;
        }

        setIsSaving(true);
        setMessage(null);

        const response = await fetchUpdateNikname({ newNikname: nextNickname });

        if (response.status === 200) {
            await refreshUser();
            setIsNameModalOpen(false);
        } else {
            setMessage("Не получилось обновить никнейм.");
        }

        setIsSaving(false);
    };

    return (
        <main className={style.page}>
            <div className="container">
                <section className={style.profileShell}>
                    <div className={style.heroPanel}>
                        <div className={style.avatarWrap}>
                            {avatarSrc ? (
                                <img src={avatarSrc} alt="avatar" className={style.avatar} />
                            ) : (
                                <Image src={icouser} alt="avatar" className={style.avatar} />
                            )}
                            <button className={style.avatarEdit} type="button" onClick={() => setIsAvatarModalOpen(true)} aria-label="Сменить аватар">
                                <Camera size={18} />
                            </button>
                        </div>

                        <div className={style.identity}>
                            <span className={style.kicker}>Личный кабинет</span>
                            <h1>{user.name || "Игрок IB Craft"}</h1>
                            <p>{user.id ? `ID: ${user.id}` : "Профиль привязан к Google-аккаунту"}</p>
                        </div>

                        <div className={style.actions}>
                            <button type="button" className={style.secondaryButton} onClick={() => setIsNameModalOpen(true)}>
                                <PenLine size={18} />
                                Никнейм
                            </button>
                            <button type="button" className={style.ghostButton} onClick={handleLogout}>
                                <LogOut size={18} />
                                Выйти
                            </button>
                        </div>
                    </div>

                    <div className={style.contentGrid}>
                        <section className={`${style.statusPanel} ${profileStatus.tone}`}>
                            <div className={style.statusIcon}>{profileStatus.icon}</div>
                            <div>
                                <h2>{profileStatus.title}</h2>
                                <p>{profileStatus.text}</p>
                            </div>
                            {profileStatus.canApply ? (
                                <Link href="/profile/get-pass" className={style.primaryButton}>
                                    Подать заявку
                                </Link>
                            ) : null}
                        </section>

                        <section className={style.infoPanel}>
                            <h2>Аккаунт</h2>
                            <div className={style.infoRow}>
                                <span>Имя</span>
                                <strong>{user.name || "Не задано"}</strong>
                            </div>
                            <div className={style.infoRow}>
                                <span>Аватар</span>
                                <strong>{user.avatarIco ? "Загружен" : "Стандартный"}</strong>
                            </div>
                        </section>
                    </div>
                </section>
            </div>

            <Modal isOpen={isNameModalOpen} onClose={() => setIsNameModalOpen(false)}>
                <form className={style.modalForm} onSubmit={handleNicknameUpdate}>
                    <h2>Смена никнейма</h2>
                    <input value={nickname} type="text" placeholder="Новый никнейм" onChange={(event) => setNickname(event.target.value)} />
                    {message ? <p className={style.formMessage}>{message}</p> : null}
                    <button type="submit" className={style.primaryButton} disabled={isSaving}>
                        {isSaving ? "Сохраняю..." : "Сохранить"}
                    </button>
                </form>
            </Modal>

            <Modal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)}>
                <form className={style.modalForm} onSubmit={handleAvatarUpload}>
                    <h2>Смена аватара</h2>
                    <label className={style.filePicker}>
                        <Camera size={18} />
                        Выбрать изображение
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                    </label>
                    {preview ? <img src={preview} alt="Preview" className={style.preview} /> : null}
                    {message ? <p className={style.formMessage}>{message}</p> : null}
                    <button type="submit" className={style.primaryButton} disabled={isSaving}>
                        {isSaving ? "Загружаю..." : "Загрузить"}
                    </button>
                </form>
            </Modal>
        </main>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    BubbleControler();

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await fetchUser();

            if (!currentUser) {
                router.replace("/auth");
                return;
            }

            setUser(currentUser);
            setIsLoading(false);
        };

        loadUser();
    }, [router]);

    if (isLoading || !user) {
        return <Loader />;
    }

    return <Profile user={user} onUserChange={setUser} />;
}
