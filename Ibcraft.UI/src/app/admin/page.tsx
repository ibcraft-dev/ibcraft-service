"use client"
import { useRouter } from 'next/navigation'
import Loader from '@components/Loader'
import { useEffect } from 'react'

export default function AdminRedirect() {
    const router = useRouter();
    // const DevMode = process.env.NEXT_PUBLIC_DEVMODE;
    useEffect(() => {
        // console.log(DevMode);
        // if (DevMode === 'production') {
        //     router.push('/');
        //     return
        // }
        router.push('/admin/home')
    }, [])

    return (
        <Loader />
    )
}
