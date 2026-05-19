"use client";

import { useEffect, useRef, useState } from "react";
import AdminContainer from "./adminContainer";
import AdminNavRequest from "./adminNavRequest";
import Dropdown from "../Dropdown/Dropdown";
import style from "./adminNav.module.css"
import dot_ico from "@static/icon_dots.svg"
import Image from "next/image"

const initRequestData = [
    { "username": "Nevormone", "status": "Pending", "createdAt": "2023-10-01T12:00:00Z"},
    { "username": "SamsonAboba", "status": "Pending", "createdAt": "2023-09-01T13:00:00Z"},
    { "username": "IlyaBot", "status": "Approved", "createdAt": "2023-10-02T14:30:00Z"},
    { "username": "Dragofox", "status": "Rejected", "createdAt": "2023-10-03T09:15:00Z"},
];

export default function AdminSideRequest() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [sortedData, setSortedData] = useState(initRequestData);
    const containerRef = useRef<HTMLUListElement>(null);
    
    const handleToggle = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    useEffect(() => {
        const handleHashChange = () => {
            let data = [...initRequestData];
            if (window.location.hash === "#new") {
                // Фильтруем и сортируем данные по статусу "Pending"
                // и дате создания (от новых к старым)
                data = data
                    .filter(item => item.status === "Pending")
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }
            else if (window.location.hash === "#approved") {
                // Фильтруем и сортируем данные по статусу "Approved"
                // и дате создания (от новых к старым)
                data = data
                    .filter(item => item.status === "Approved")
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }
            else if (window.location.hash === "#rejected") {
                // Фильтруем и сортируем данные по статусу "Rejected"
                // и дате создания (от новых к старым)
                data = data
                    .filter(item => item.status === "Rejected")
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            } 
            else if (window.location.hash === "#all") {
                data = initRequestData; // Default case
            }

            setSortedData(data);
        };

        window.addEventListener("hashchange", handleHashChange);
        handleHashChange(); // вызов при монтировании

        return () => window.removeEventListener("hashchange", handleHashChange);
         
    }, [])

    return (
        <AdminContainer>
            <AdminNavRequest />
            <ul ref={containerRef} className={style.itemsListUser}>
                    {sortedData.map((data, index) => (
                        <li key={index} className={style.itemUser}>
                            <div className={style.userTitle}>
                                    <input type="checkbox" name="" id="" />     
                                    <a href="" className={style.user_name}>Заявка от игрока {data.username}</a>
                            </div>
                            <div className={style.opt}>
                                    <Dropdown isOpen={openIndex === index} onToggle={() => handleToggle(index)} 
                                        icon={<Image src={dot_ico} width={20} height={20} alt="dots" />} >
                                        <ul className={style.dropdownContent}>
                                            <li><a href="#">View</a></li>
                                            <li><a href="#">Edit</a></li>
                                            <li><a href="#">Delete</a></li>
                                        </ul>
                                    </Dropdown>
                            </div>
                        </li>
                    ))}
                </ul>
        </AdminContainer>
    );
}