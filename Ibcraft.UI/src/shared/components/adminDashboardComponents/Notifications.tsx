"use client";

import Link from "next/link";
import { Bell, CheckCircle2, ChevronLeft, ChevronRight, Inbox, Search, Trash2, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import style from "./Notifcations.module.css";

type NotificationType = "request" | "user" | "system";

type NotificationItem = {
    id: number;
    title: string;
    text: string;
    time: string;
    path: string;
    type: NotificationType;
    unread: boolean;
};

const demoNotifications: NotificationItem[] = [
    {
        id: 1,
        title: "Новые заявки на проходку",
        text: "Появились 2 новые заявки, их можно проверить в разделе заявок.",
        time: "5 минут назад",
        path: "/admin/request#new",
        type: "request",
        unread: true,
    },
    {
        id: 2,
        title: "Новый пользователь",
        text: "Пользователь Dragofox зарегистрировался на сайте.",
        time: "20 минут назад",
        path: "/admin/user",
        type: "user",
        unread: true,
    },
    {
        id: 3,
        title: "Система",
        text: "Демо-уведомление для проверки внешнего вида списка.",
        time: "Сегодня",
        path: "/admin/home",
        type: "system",
        unread: false,
    },
];

const getIcon = (type: NotificationType) => {
    if (type === "request") return <CheckCircle2 size={20} />;
    if (type === "user") return <UserPlus size={20} />;

    return <Bell size={20} />;
};

export default function Notifications() {
    const [notifications, setNotifications] = useState(demoNotifications);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filteredNotifications = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return notifications;
        }

        return notifications.filter((notification) =>
            `${notification.title} ${notification.text}`.toLowerCase().includes(normalizedSearch)
        );
    }, [notifications, search]);

    const unreadCount = notifications.filter((notification) => notification.unread).length;
    const pageCount = Math.max(1, Math.ceil(filteredNotifications.length / pageSize));
    const visibleNotifications = filteredNotifications.slice((page - 1) * pageSize, page * pageSize);
    const firstVisible = filteredNotifications.length ? (page - 1) * pageSize + 1 : 0;
    const lastVisible = Math.min(page * pageSize, filteredNotifications.length);

    const handleClear = () => {
        setNotifications([]);
        setPage(1);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <section className={style.notificationsPage}>
            <header className={style.notificationsHeader}>
                <div>
                    <span className={style.kicker}>Админ-панель</span>
                    <h1>Оповещения</h1>
                    <p>Быстрый список событий по заявкам, пользователям и системным действиям.</p>
                </div>

                <div className={style.notificationsStats}>
                    <div>
                        <strong>{notifications.length}</strong>
                        <span>всего</span>
                    </div>
                    <div>
                        <strong>{unreadCount}</strong>
                        <span>новых</span>
                    </div>
                </div>
            </header>

            <div className={style.notificationsToolbar}>
                <label className={style.searchBox}>
                    <Search size={19} />
                    <input
                        value={search}
                        onChange={(event) => handleSearch(event.target.value)}
                        placeholder="Поиск по уведомлениям"
                        type="search"
                    />
                </label>

                <button className={style.clearButton} type="button" onClick={handleClear} disabled={!notifications.length}>
                    <Trash2 size={18} />
                    Очистить
                </button>
            </div>

            <div className={style.notificationsList}>
                {visibleNotifications.map((notification) => (
                    <Link href={notification.path} className={style.notificationRow} key={notification.id}>
                        <span className={`${style.iconBadge} ${notification.unread ? style.unreadIcon : ""}`}>
                            {getIcon(notification.type)}
                        </span>
                        <span className={style.notificationText}>
                            <span>
                                {notification.title}
                                {notification.unread && <em>Новое</em>}
                            </span>
                            <small>{notification.text}</small>
                        </span>
                        <span className={style.notificationMeta}>{notification.time}</span>
                    </Link>
                ))}

                {!filteredNotifications.length && (
                    <div className={style.emptyState}>
                        <Inbox size={34} />
                        <p>Оповещений пока нет.</p>
                    </div>
                )}

                {!!filteredNotifications.length && (
                    <footer className={style.notificationsFooter}>
                        <span>
                            {firstVisible}-{lastVisible} из {filteredNotifications.length}
                        </span>

                        <label className={style.pageSizeSelect}>
                            На странице
                            <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
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
    );
}
