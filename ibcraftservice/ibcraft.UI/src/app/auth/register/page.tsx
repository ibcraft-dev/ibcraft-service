import AuthContainer from "@components/Auth/AuthContainer";
import RegisterBlock from "@components/Auth/RegisterBlock";
import BubbleBackground from "@components/EffectComponents/BubbleContainer";

export default function Register() {
    return (
        <>
            <BubbleBackground />
            <AuthContainer>
                <RegisterBlock />
            </AuthContainer>
        </>
    )
}