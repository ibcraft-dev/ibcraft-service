"use client"; 

import { usePathname } from "next/navigation";
import Header from "./Header/Header"; // Ваш компонент Header

export default function ConditionalHeader() {
  const pathname = usePathname(); 
  const isAdminPage = pathname?.startsWith("/admin"); 


  return !isAdminPage ? <Header /> : null;
}