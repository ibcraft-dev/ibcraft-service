"use client"
import AdminSideNav from '@components/adminDashboardComponents/adminSideNav';
import styles from '@components/adminDashboardComponents/adminSideNav.module.css'
import React, { useEffect } from 'react';


export default function AdminLayout({ children } : Readonly<{children: React.ReactNode;}>)  {
    useEffect(() => {
        document.body.style.background = "#13061E";
    }, [])
    return (
        <>
            <AdminSideNav/>
            <section className={styles.home}>
                {children}
            </section>
        </>
    )
}