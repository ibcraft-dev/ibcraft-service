"use client"
import AdminSideNav from '@components/adminDashboardComponents/adminSideNav';
import styles from '@components/adminDashboardComponents/adminSideNav.module.css'
import Loader from '@components/Loader';
import { fetchAdminMe } from '@hooks/hookAdmin';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


export default function AdminLayout({ children } : Readonly<{children: React.ReactNode;}>)  {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/admin/login";
    const [isAllowed, setIsAllowed] = useState(isLoginPage);

    useEffect(() => {
        document.body.style.background = "#13061E";
    }, []);

    useEffect(() => {
        if (isLoginPage) {
            setIsAllowed(true);
            return;
        }

        const checkAdmin = async () => {
            const response = await fetchAdminMe();

            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }

            if (response.status !== 200) {
                router.replace("/");
                return;
            }

            setIsAllowed(true);
        };

        setIsAllowed(false);
        checkAdmin();
    }, [isLoginPage, router]);

    if (isLoginPage) {
        return <>{children}</>;
    }

    if (!isAllowed) {
        return <Loader />;
    }

    return (
        <>
            <AdminSideNav/>
            <section className={styles.home}>
                {children}
            </section>
        </>
    )
}
