"use client";

import LoginBlock from "@components/Auth/LoginBlock";
import AuthContainer from "@components/Auth/AuthContainer";
import BubbleBackground from "@components/EffectComponents/BubbleContainer";

export default function Login() {
    return (
        <>
            <BubbleBackground />
            <AuthContainer>
                <LoginBlock />
            </AuthContainer>
        </>
    )
 }
