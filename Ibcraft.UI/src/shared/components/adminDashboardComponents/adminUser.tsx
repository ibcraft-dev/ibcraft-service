"use client";

import {
    Ban,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Pencil,
    Search,
    Shield,
    Trash2,
    UserRound,
} from "lucide-react";
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
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
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
        setPage(1);
    }, [search, pageSize]);

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

    const pageCount = Math.max(1, Math.ceil(users.length / pageSize));
    const visibleUsers = users.slice((page - 1) * pageSize, page * pageSize);
    const firstVisible = users.length ? (page - 1) * pageSize + 1 : 0;
    const lastVisible = Math.min(page * pageSize, users.length);

    const handleUserUpdate = (updatedUser: AdminManagedUser) => {
        setUsers((currentUsers) =>
            currentUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        setSelectedUser(updatedUser);
    };

    const handleUnavailableAction = (action: string, username: string) => {
        setOpenMenuId(null);
        setMessage(`${action} для ${username}: действие пока не подключено к API.`);
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
                    {visibleUsers.map((user) => (
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
                                        {user.role.toLowerCase() !== "admin" && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUnavailableAction("Бан", user.username)}
                                                >
                                                    <Ban size={16} />
                                                    Забанить
                                                </button>
                                                <button
                                                    type="button"
                                                    className={style.dangerAction}
                                                    onClick={() => handleUnavailableAction("Удаление", user.username)}
                                                >
                                                    <Trash2 size={16} />
                                                    Удалить
                                                </button>
                                            </>
                                        )}
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

                    {!!users.length && (
                        <footer className={style.usersFooter}>
                            <span>
                                {firstVisible}-{lastVisible} из {users.length}
                            </span>

                            <label className={style.pageSizeSelect}>
                                На странице
                                <select
                                    value={pageSize}
                                    onChange={(event) => setPageSize(Number(event.target.value))}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                </select>
                            </label>

                            <div className={style.paginationControls}>
                                <button
                                    type="button"
                                    onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                                    disabled={page === 1}
                                    aria-label="Предыдущая страница"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <strong>{page} из {pageCount}</strong>
                                <button
                                    type="button"
                                    onClick={() => setPage((currentPage) => Math.min(pageCount, currentPage + 1))}
                                    disabled={page === pageCount}
                                    aria-label="Следующая страница"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </footer>
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
