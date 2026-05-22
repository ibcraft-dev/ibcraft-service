"use client";

import { createContext, useContext, useState } from "react";


interface AlertContextType {
    alertMessage?: string | null;
    alertColor?: string;
    alertSuccess?: boolean;
    setAlert: (message: string, color: string) => void;
    clearAlert: () => void;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertColor, setAlertColor] = useState<string>("green");
    const [alertSuccess, setAlertSuccess] = useState<boolean>(false);

  
    const setAlert = (message: string, color: string) => {
        setAlertMessage(message);
        setAlertColor(color);
        setAlertSuccess(true);
        setTimeout(() => {
            setAlertSuccess(false);
        }, 3000);
        
    };

    const clearAlert = () => {
        setAlertMessage(null);
        setAlertSuccess(false);
    };

    return (
        <AlertContext.Provider value={{ setAlert, clearAlert, alertMessage, alertColor, alertSuccess }}>
            {children}
        </AlertContext.Provider>
    )
 };


 export const useAlert = () => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within a AlertProvider');
    }
    return context;
}