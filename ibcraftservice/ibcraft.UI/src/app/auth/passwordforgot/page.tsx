"use client";

import AuthContainer from "@components/Auth/AuthContainer";
import PasswordForgotBlock from "@components/Auth/PasswordForgot";
import BubbleBackground from "@components/EffectComponents/BubbleContainer";
import { useAlert } from "@components/alert/alertContext";
import Alert from "@components/alert/succesAlert";

export default function PasswordForgot() {
    const { alertMessage, alertColor, alertSuccess } = useAlert();
    
    return (
        <>
            {alertMessage && (
                <Alert Success={alertSuccess} Color={alertColor}>
                    {alertMessage}
                </Alert>
            )}
            <BubbleBackground />
            <AuthContainer>
                <PasswordForgotBlock />
            </AuthContainer>
        </>
    )
}