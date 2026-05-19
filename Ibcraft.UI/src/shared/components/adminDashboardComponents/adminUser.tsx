"use client";

import Image from "next/image"
import AdminNavUser from "./adminNavUser"
import style from "./adminNav.module.css"
import user_ico from "@static/user.svg"
import dot_ico from "@static/icon_dots.svg"
import Dropdown from "../Dropdown/Dropdown"
import { useEffect, useRef, useState } from "react"
import AdminContainer from "./adminContainer";
import AdminSideBarUser from "./adminSideBarUser";

// Mock data for users
const users = [
    {username: "IlyaBot", role: "Admin", email: "admin@mail.com", discord: "IlyaBot#1234" , createdAt: "2023-10-01T12:00:00Z", emailVerified: true}, 
    {username: "Dragofox", role: "User", email: "foxgay@mail.com", discord: "Dragofox#5678", createdAt: "2023-09-01T13:00:00Z", emailVerified: true},];

export default function AdminUsers() {

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLUListElement>(null);
    const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpenIndex(null); // Закрыть всё
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <>
           <AdminContainer>
                <AdminNavUser />
                <ul ref={containerRef} className={style.itemsListUser}>
                    {users.map((user, index) => (
                        <li key={index} className={style.itemUser}>
                            <div className={style.userTitle}>
                                    <input type="checkbox" name="" id="" />
                                    <Image src={user_ico} width={20} height={20} alt="user" className={style.user_iocns} />
                                    {user.role === "Admin" && < i className='bx  bxs-crown'  ></i> }
                                    <a href="#" className={style.user_name} onClick={() => setSelectedUser(user)}>{user.username}</a>
                            </div>
                            <div className={style.opt}>
                                    <Dropdown isOpen={openIndex === index} onToggle={() => handleToggle(index)} 
                                    icon={<Image src={dot_ico} width={20} height={20} alt="dots" />} >
                                        <ul className={style.dropdownContent}>
                                            <li><a href="#" onClick={() => setSelectedUser(user)}>Edit</a></li>
                                            {user.role !== "Admin" && 
                                                <li><a href="#">Delete</a></li>  
                                            }
                                            {user.role !== "Admin" && 
                                                <li><a href="#">Ban</a></li>  
                                            }
                                        </ul>
                                    </Dropdown>
                            </div>
                        </li>
                    ))}
                </ul>
                {selectedUser && (
                    <AdminSideBarUser
                        isOpen={!!selectedUser}
                        onClose={() => setSelectedUser(null)}
                        user={selectedUser}
                    />
                )}
           </AdminContainer>
        </>
    )
}