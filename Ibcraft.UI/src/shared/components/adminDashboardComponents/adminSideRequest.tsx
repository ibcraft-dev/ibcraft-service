"use client";

import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Eye,
    FileText,
    Search,
    Trash2,
    X,
    XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
    approveQuestionnaire,
    deleteQuestionnaire,
    fetchAdminQuestionnaires,
    rejectQuestionnaire,
} from "@hooks/HookQuestionnaire";
import type { AdminQuestionnaire } from "@hooks/HookQuestionnaire";
import AdminContainer from "./adminContainer";
import style from "./adminRequest.module.css";

const demoRequests: AdminQuestionnaire[] = [
    {
        id: "demo-request-1",
        userId: "f2f9f4a1-8d6a-4f6a-bf45-2f3b9115e001",
        age: 18,
        playingTime: "6 лет",
        acceptRule: true,
        playingServer: true,
        licenseMinecraft: true,
        buildingLevel: 8,
        adequacyLevel: 9,
        description: "Хочу строить город, помогать новичкам и участвовать в ивентах.",
        status: "Pending",
    },
    {
        id: "demo-request-2",
        userId: "7a914cc4-f224-46af-a0a2-77426b89e002",
        age: 15,
        playingTime: "3 года",
        acceptRule: true,
        playingServer: false,
        licenseMinecraft: false,
        buildingLevel: 5,
        adequacyLevel: 7,
        description: "Планирую выживать с друзьями и построить небольшую базу.",
        status: "Approved",
    },
    {
        id: "demo-request-3",
        userId: "a581733d-e0c5-44de-a10d-d47b78a2e003",
        age: 13,
        playingTime: "1 год",
        acceptRule: false,
        playingServer: false,
        licenseMinecraft: true,
        buildingLevel: 3,
        adequacyLevel: 4,
        description: "Хочу попробовать сервер и посмотреть, как тут играют.",
        status: "Reject",
    },
];

const getDescription = (request: AdminQuestionnaire) => request.description ?? request.discription ?? "";

const normalizeStatus = (status: string) => status.toLowerCase();

const getStatusLabel = (status: string) => {
    const normalizedStatus = normalizeStatus(status);

    if (normalizedStatus === "approved") return "Одобрена";
    if (normalizedStatus === "reject" || normalizedStatus === "rejected") return "Отклонена";

    return "На рассмотрении";
};

const getStatusClass = (status: string) => {
    const normalizedStatus = normalizeStatus(status);

    if (normalizedStatus === "approved") return style.approvedBadge;
    if (normalizedStatus === "reject" || normalizedStatus === "rejected") return style.rejectedBadge;

    return style.pendingBadge;
};

const shortId = (id: string) => id.length > 8 ? id.slice(0, 8) : id;

export default function AdminSideRequest() {
    const [requests, setRequests] = useState<AdminQuestionnaire[]>(demoRequests);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeRequest, setActiveRequest] = useState<AdminQuestionnaire | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [message, setMessage] = useState("Демо-данные, пока API недоступен.");
    const [isLoading, setIsLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const loadRequests = async () => {
            setIsLoading(true);
            const response = await fetchAdminQuestionnaires();

            if (response.data) {
                setRequests(response.data);
                setMessage(response.data.length ? "Данные загружены из API." : "Заявок пока нет.");
            } else {
                setRequests(demoRequests);
                setMessage("API недоступен, показаны демо-данные.");
            }

            setIsLoading(false);
        };

        loadRequests();
    }, []);

    useEffect(() => {
        const syncHashFilter = () => {
            const hash = window.location.hash;

            if (hash === "#new") {
                setStatusFilter("new");
                return;
            }

            if (hash === "#approved") {
                setStatusFilter("approved");
                return;
            }

            if (hash === "#rejected") {
                setStatusFilter("rejected");
                return;
            }

            setStatusFilter("all");
        };

        syncHashFilter();
        window.addEventListener("hashchange", syncHashFilter);

        return () => window.removeEventListener("hashchange", syncHashFilter);
    }, []);

    const filteredRequests = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return requests
            .filter((request) => {
                const status = normalizeStatus(request.status);

                if (statusFilter === "new") return status === "pending";
                if (statusFilter === "approved") return status === "approved";
                if (statusFilter === "rejected") return status === "reject" || status === "rejected";

                return true;
            })
            .filter((request) => {
                if (!normalizedSearch) return true;

                return `${request.userId} ${request.id} ${getDescription(request)}`
                    .toLowerCase()
                    .includes(normalizedSearch);
            });
    }, [requests, search, statusFilter]);

    const visibleRequests = filteredRequests.slice((page - 1) * pageSize, page * pageSize);
    const pageCount = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
    const firstVisible = filteredRequests.length ? (page - 1) * pageSize + 1 : 0;
    const lastVisible = Math.min(page * pageSize, filteredRequests.length);
    const selectedCount = selectedIds.length;
    const pendingCount = requests.filter((request) => normalizeStatus(request.status) === "pending").length;

    useEffect(() => {
        setPage(1);
        setSelectedIds((currentIds) => currentIds.filter((id) => filteredRequests.some((request) => request.id === id)));
    }, [filteredRequests]);

    useEffect(() => {
        setPage((currentPage) => Math.min(currentPage, pageCount));
    }, [pageCount]);

    const toggleRequest = (id: string) => {
        setSelectedIds((currentIds) =>
            currentIds.includes(id)
                ? currentIds.filter((currentId) => currentId !== id)
                : [...currentIds, id]
        );
    };

    const toggleVisible = () => {
        const visibleIds = visibleRequests.map((request) => request.id);
        const isEveryVisibleSelected = visibleIds.every((id) => selectedIds.includes(id));

        setSelectedIds((currentIds) => {
            if (isEveryVisibleSelected) {
                return currentIds.filter((id) => !visibleIds.includes(id));
            }

            return Array.from(new Set([...currentIds, ...visibleIds]));
        });
    };

    const updateSelectedStatus = async (nextStatus: "Approved" | "Reject") => {
        const action = nextStatus === "Approved" ? approveQuestionnaire : rejectQuestionnaire;

        await Promise.all(selectedIds.map((id) => action(id)));
        setRequests((currentRequests) =>
            currentRequests.map((request) =>
                selectedIds.includes(request.id) ? { ...request, status: nextStatus } : request
            )
        );
        setMessage(nextStatus === "Approved" ? "Выбранные заявки приняты." : "Выбранные заявки отклонены.");
        setSelectedIds([]);
    };

    const deleteSelected = async () => {
        if (!window.confirm(`Удалить выбранные заявки: ${selectedCount}?`)) {
            return;
        }

        await Promise.all(selectedIds.map((id) => deleteQuestionnaire(id)));
        setRequests((currentRequests) => currentRequests.filter((request) => !selectedIds.includes(request.id)));
        setMessage("Выбранные заявки удалены.");
        setSelectedIds([]);
    };

    return (
        <AdminContainer>
            <section className={style.requestsPage}>
                <header className={style.requestsHeader}>
                    <div>
                        <span className={style.kicker}>Админ-панель</span>
                        <h1>Заявки на проходку</h1>
                        <p>Проверка анкет игроков, массовое одобрение, отклонение и удаление.</p>
                    </div>

                    <div className={style.requestsStats}>
                        <div>
                            <strong>{requests.length}</strong>
                            <span>всего</span>
                        </div>
                        <div>
                            <strong>{pendingCount}</strong>
                            <span>новых</span>
                        </div>
                    </div>
                </header>

                <div className={style.actionsBar}>
                    <button type="button" onClick={() => updateSelectedStatus("Approved")} disabled={!selectedCount}>
                        <CheckCircle2 size={18} />
                        Принять выбранное
                    </button>
                    <button type="button" onClick={() => updateSelectedStatus("Reject")} disabled={!selectedCount}>
                        <XCircle size={18} />
                        Отклонить выбранное
                    </button>
                    <button type="button" className={style.dangerButton} onClick={deleteSelected} disabled={!selectedCount}>
                        <Trash2 size={18} />
                        Удалить выбранное
                    </button>
                </div>

                <div className={style.requestsToolbar}>
                    <label className={style.searchBox}>
                        <Search size={19} />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Поиск по ID или описанию"
                            type="search"
                        />
                    </label>
                    <span className={style.toolbarStatus}>
                        {isLoading ? "Загрузка..." : `${message} Выбрано: ${selectedCount}`}
                    </span>
                </div>

                <div className={style.requestsList}>
                    {!!visibleRequests.length && (
                        <label className={style.selectAllRow}>
                            <input
                                type="checkbox"
                                checked={visibleRequests.every((request) => selectedIds.includes(request.id))}
                                onChange={toggleVisible}
                            />
                            Выбрать заявки на этой странице
                        </label>
                    )}

                    {visibleRequests.map((request) => (
                        <article className={style.requestRow} key={request.id}>
                            <input
                                className={style.rowCheckbox}
                                type="checkbox"
                                checked={selectedIds.includes(request.id)}
                                onChange={() => toggleRequest(request.id)}
                                aria-label={`Выбрать заявку ${request.id}`}
                            />

                            <span className={style.iconBadge}>
                                <FileText size={20} />
                            </span>

                            <button className={style.requestMain} type="button" onClick={() => setActiveRequest(request)}>
                                <span>
                                    Заявка #{shortId(request.id)}
                                    <em className={getStatusClass(request.status)}>{getStatusLabel(request.status)}</em>
                                </span>
                                <small>Игрок: {shortId(request.userId)} · Возраст: {request.age} · Minecraft: {request.playingTime}</small>
                            </button>

                            <div className={style.requestMeta}>
                                <span>Строительство: {request.buildingLevel}/10</span>
                                <span>Адекватность: {request.adequacyLevel}/10</span>
                            </div>

                            <button className={style.previewButton} type="button" onClick={() => setActiveRequest(request)}>
                                <Eye size={18} />
                                Смотреть
                            </button>
                        </article>
                    ))}

                    {!filteredRequests.length && (
                        <div className={style.emptyState}>
                            <FileText size={34} />
                            <p>Заявки не найдены.</p>
                        </div>
                    )}

                    {!!filteredRequests.length && (
                        <footer className={style.requestsFooter}>
                            <span>
                                {firstVisible}-{lastVisible} из {filteredRequests.length}
                            </span>

                            <label className={style.pageSizeSelect}>
                                На странице
                                <select
                                    value={pageSize}
                                    onChange={(event) => {
                                        setPageSize(Number(event.target.value));
                                        setPage(1);
                                    }}
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

            {activeRequest && (
                <div className={style.previewOverlay} onClick={() => setActiveRequest(null)}>
                    <section className={style.previewModal} onClick={(event) => event.stopPropagation()}>
                        <button className={style.closeButton} type="button" onClick={() => setActiveRequest(null)} aria-label="Закрыть">
                            <X size={22} />
                        </button>

                        <header className={style.previewHeader}>
                            <span className={style.iconBadge}>
                                <FileText size={22} />
                            </span>
                            <div>
                                <span className={style.kicker}>Предпросмотр заявки</span>
                                <h2>Заявка #{shortId(activeRequest.id)}</h2>
                                <p>Пользователь: {activeRequest.userId}</p>
                            </div>
                        </header>

                        <div className={style.previewGrid}>
                            <div><span>Статус</span><strong>{getStatusLabel(activeRequest.status)}</strong></div>
                            <div><span>Возраст</span><strong>{activeRequest.age}</strong></div>
                            <div><span>Опыт Minecraft</span><strong>{activeRequest.playingTime}</strong></div>
                            <div><span>Правила прочитаны</span><strong>{activeRequest.acceptRule ? "Да" : "Нет"}</strong></div>
                            <div><span>Играл на RP серверах</span><strong>{activeRequest.playingServer ? "Да" : "Нет"}</strong></div>
                            <div><span>Лицензия Minecraft</span><strong>{activeRequest.licenseMinecraft ? "Да" : "Нет"}</strong></div>
                            <div><span>Строительство</span><strong>{activeRequest.buildingLevel}/10</strong></div>
                            <div><span>Адекватность</span><strong>{activeRequest.adequacyLevel}/10</strong></div>
                        </div>

                        <div className={style.descriptionBlock}>
                            <span>Чем игрок планирует заниматься на сервере</span>
                            <p>{getDescription(activeRequest) || "Описание не заполнено."}</p>
                        </div>
                    </section>
                </div>
            )}
        </AdminContainer>
    );
}
