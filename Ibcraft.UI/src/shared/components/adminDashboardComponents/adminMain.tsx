"use client";

import { useMemo, useState } from "react";
import style from "./adminStatus.module.css";

type MonthStats = {
    day: number;
    newRequests: number;
    approved: number;
    rejected: number;
};

const MONTHS = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
];

const YEARS = [2024, 2025, 2026];

const buildDemoStats = (year: number, month: number): MonthStats[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = Math.max(1, daysInMonth - 29);

    return Array.from({ length: daysInMonth - startDay + 1 }, (_, index) => {
        const day = startDay + index;
        const wave = (day + month * 3 + year) % 9;
        const newRequests = 5 + ((day * 2 + month) % 11);
        const approved = 3 + ((wave + day) % 8);
        const rejected = 1 + ((day + month * 2) % 5);

        return {
            day,
            newRequests,
            approved,
            rejected,
        };
    });
};

export default function AdminMain() {
    const [selectedYear, setSelectedYear] = useState(2026);
    const [selectedMonth, setSelectedMonth] = useState(6);

    const stats = useMemo(
        () => buildDemoStats(selectedYear, selectedMonth),
        [selectedYear, selectedMonth]
    );

    const totals = useMemo(
        () =>
            stats.reduce(
                (result, item) => ({
                    newRequests: result.newRequests + item.newRequests,
                    approved: result.approved + item.approved,
                    rejected: result.rejected + item.rejected,
                    all: result.all + item.newRequests + item.approved + item.rejected,
                }),
                { newRequests: 0, approved: 0, rejected: 0, all: 0 }
            ),
        [stats]
    );

    const maxTotal = Math.max(
        ...stats.map((item) => item.newRequests + item.approved + item.rejected)
    );

    return (
        <section className={style.dashboard}>
            <div className={style.headerPanel}>
                <div>
                    <span className={style.kicker}>Админ-панель</span>
                    <h1 className={style.title}>Статистика заявок</h1>
                    <p className={style.description}>
                        Примерные данные за последние 30 дней выбранного месяца.
                    </p>
                </div>

                <div className={style.periodControls} aria-label="Период статистики">
                    <label>
                        <span>Год</span>
                        <select
                            value={selectedYear}
                            onChange={(event) => setSelectedYear(Number(event.target.value))}
                        >
                            {YEARS.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Месяц</span>
                        <select
                            value={selectedMonth}
                            onChange={(event) => setSelectedMonth(Number(event.target.value))}
                        >
                            {MONTHS.map((month, index) => (
                                <option key={month} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            <div className={style.statsGrid}>
                <article className={style.statItem}>
                    <span className={style.statNumber}>{totals.newRequests}</span>
                    <span className={style.statLabel}>Новые заявки</span>
                </article>
                <article className={style.statItem}>
                    <span className={style.statNumber}>{totals.approved}</span>
                    <span className={style.statLabel}>Одобренные заявки</span>
                </article>
                <article className={style.statItem}>
                    <span className={style.statNumber}>{totals.rejected}</span>
                    <span className={style.statLabel}>Отказы</span>
                </article>
                <article className={style.statItem}>
                    <span className={style.statNumber}>{totals.all}</span>
                    <span className={style.statLabel}>Всего за период</span>
                </article>
            </div>

            <div className={style.contentGrid}>
                <section className={style.chartPanel}>
                    <div className={style.panelHeader}>
                        <div>
                            <h2>Динамика за 30 дней</h2>
                            <p>{MONTHS[selectedMonth]} {selectedYear}</p>
                        </div>

                        <div className={style.legend}>
                            <span className={style.legendNew}>Новые</span>
                            <span className={style.legendApproved}>Одобрено</span>
                            <span className={style.legendRejected}>Отказы</span>
                        </div>
                    </div>

                    <div className={style.chartScroll}>
                        <div className={style.chart} aria-label="График заявок по датам">
                            {stats.map((item) => {
                                const total = item.newRequests + item.approved + item.rejected;
                                const height = Math.max(22, Math.round((total / maxTotal) * 100));

                                return (
                                    <div className={style.barColumn} key={item.day}>
                                        <div className={style.barStack} style={{ height: `${height}%` }}>
                                            <span
                                                className={`${style.segment} ${style.segmentNew}`}
                                                style={{ flexGrow: item.newRequests }}
                                                tabIndex={0}
                                            >
                                                <span className={style.tooltip}>
                                                    {item.day} {MONTHS[selectedMonth].toLowerCase()}: новые заявки - {item.newRequests}
                                                </span>
                                            </span>
                                            <span
                                                className={`${style.segment} ${style.segmentApproved}`}
                                                style={{ flexGrow: item.approved }}
                                                tabIndex={0}
                                            >
                                                <span className={style.tooltip}>
                                                    {item.day} {MONTHS[selectedMonth].toLowerCase()}: одобрено - {item.approved}
                                                </span>
                                            </span>
                                            <span
                                                className={`${style.segment} ${style.segmentRejected}`}
                                                style={{ flexGrow: item.rejected }}
                                                tabIndex={0}
                                            >
                                                <span className={style.tooltip}>
                                                    {item.day} {MONTHS[selectedMonth].toLowerCase()}: отказов - {item.rejected}
                                                </span>
                                            </span>
                                        </div>
                                        <span className={style.dayLabel}>{item.day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <aside className={style.summaryPanel}>
                    <div className={style.panelHeader}>
                        <div>
                            <h2>Сводка</h2>
                            <p>Демо-данные</p>
                        </div>
                    </div>

                    <div className={style.summaryList}>
                        <div className={style.summaryItem}>
                            <span>Среднее заявок в день</span>
                            <strong>{Math.round(totals.all / stats.length)}</strong>
                        </div>
                        <div className={style.summaryItem}>
                            <span>Доля одобрений</span>
                            <strong>{Math.round((totals.approved / totals.all) * 100)}%</strong>
                        </div>
                        <div className={style.summaryItem}>
                            <span>Доля отказов</span>
                            <strong>{Math.round((totals.rejected / totals.all) * 100)}%</strong>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}
