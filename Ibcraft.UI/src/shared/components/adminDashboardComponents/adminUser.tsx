"use client";

import { MoreVertical, Pencil, Search, Shield, UserRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    AdminManagedUser,
    fetchAdminUsers,
} from "@hooks/hookAdmin";
import AdminContainer from "./adminContainer";
import AdminSideBarUser from "./adminSideBarUser";
import style from "./adminNav.module.css";

const demoUsers: AdminManagedUser[] = [
    {
        id: "demo-admin",
        username: "IlyaBot",
        role: "Admin",
        roles: ["Admin"],
        email: "admin@mail.com",
        createdAt: "2023-10-01T12:00:00Z",
        emailVerified: true,
    },
    {
        id: "demo-user",
        username: "Dragofox",
        role: "User",
        roles: ["User"],
        email: "foxgay@mail.com",
        createdAt: "2023-09-01T13:00:00Z",
        emailVerified: true,
    },
];

export default function AdminUsers() {
    const [users, setUsers] = useState<AdminManagedUser[]>(demoUsers);
    const [selectedUser, setSelectedUser] = useState<AdminManagedUser | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("Демо-данные, пока API недоступен.");
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(async () => {
            setIsLoading(true);
            const response = await fetchAdminUsers(search.trim());

            if (response.data) {
                setUsers(response.data);
                setMessage(response.data.length ? "Данные загружены из API." : "Пользователи не найдены.");
            } else {
                const normalizedSearch = search.trim().toLowerCase();
                const filteredDemoUsers = demoUsers.filter((user) =>
                    user.username.toLowerCase().includes(normalizedSearch)
                );

                setUsers(filteredDemoUsers);
                setMessage("API недоступен, показаны демо-данные.");
            }

            setIsLoading(false);
        }, 280);

        return () => window.clearTimeout(timeoutId);
    }, [search]);

    const totalAdmins = useMemo(
        () => users.filter((user) => user.role.toLowerCase() === "admin").length,
        [users]
    );

    const handleUserUpdate = (updatedUser: AdminManagedUser) => {
        setUsers((currentUsers) =>
            currentUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        setSelectedUser(updatedUser);
    };

    return (
        <AdminContainer>
            <section className={style.usersPage}>
                <header className={style.usersHeader}>
                    <div>
                        <span className={style.kicker}>Админ-панель</span>
                        <h1>Пользователи</h1>
                        <p>Поиск, роли и быстрые действия по аккаунтам сервера.</p>
                    </div>

                    <div className={style.usersStats}>
                        <div>
                            <strong>{users.length}</strong>
                            <span>найдено</span>
                        </div>
                        <div>
                            <strong>{totalAdmins}</strong>
                            <span>админов</span>
                        </div>
                    </div>
                </header>

                <div className={style.usersToolbar}>
                    <label className={style.searchBox}>
                        <Search size={19} />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Поиск по нику"
                            type="search"
                        />
                    </label>
                    <span className={style.toolbarStatus}>{isLoading ? "Загрузка..." : message}</span>
                </div>

                <div className={style.usersList} ref={menuRef}>
                    {users.map((user) => (
                        <article className={style.userRow} key={user.id}>
                            <button
                                className={style.userMain}
                                type="button"
                                onClick={() => setSelectedUser(user)}
                            >
                                <span className={style.avatarBadge}>
                                    {user.role.toLowerCase() === "admin" ? <Shield size={20} /> : <UserRound size={20} />}
                                </span>
                                <span className={style.userText}>
                                    <span>
                                        {user.username}
                                        <em className={user.role.toLowerCase() === "admin" ? style.roleAdmin : style.roleUser}>
                                            {user.role}
                                        </em>
                                    </span>
                                    <small>{user.email || "Email не указан"}</small>
                                </span>
                            </button>

                            <div className={style.userMeta}>
                                <span>{new Date(user.createdAt).toLocaleDateString("ru-RU")}</span>
                                <span className={user.emailVerified ? style.verified : style.unverified}>
                                    {user.emailVerified ? "Email подтвержден" : "Email не подтвержден"}
                                </span>
                            </div>

                            <div className={style.actionCell}>
                                <button
                                    type="button"
                                    className={style.moreButton}
                                    aria-label={`Действия для ${user.username}`}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setOpenMenuId((currentId) => currentId === user.id ? null : user.id);
                                    }}
                                >
                                    <MoreVertical size={21} />
                                </button>

                                {openMenuId === user.id && (
                                    <div className={style.actionMenu}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setOpenMenuId(null);
                                            }}
                                        >
                                            <Pencil size={16} />
                                            Изменить
                                        </button>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}

                    {!users.length && (
                        <div className={style.emptyState}>
                            <Search size={32} />
                            <p>Пользователи по такому нику не найдены.</p>
                        </div>
                    )}
                </div>
            </section>

            {selectedUser && (
                <AdminSideBarUser
                    isOpen={!!selectedUser}
                    onClose={() => setSelectedUser(null)}
                    user={selectedUser}
                    onUserUpdate={handleUserUpdate}
                />
            )}
        </AdminContainer>
    );
}
