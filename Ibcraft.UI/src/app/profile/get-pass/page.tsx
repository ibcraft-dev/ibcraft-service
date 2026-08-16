"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAlert } from "@components/alert/alertContext";
import Alert from "@components/alert/succesAlert";
import BubbleControler from "@components/EffectComponents/BubbleControler";
import FormPass from "@components/forms/formspass";
import ProtectedForm from "@components/forms/ProtectedForm";
import Loader from "@components/Loader";
import { fetchUser, needsMinecraftNickname } from "@hooks/hookUser";
import { User } from "@hooks/IUser";

export default function GetPenetrationPage() {
    const router = useRouter();
    const { alertMessage, alertColor, alertSuccess } = useAlert();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    BubbleControler();

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await fetchUser();

            if (!currentUser) {
                router.replace("/auth");
                return;
            }

            if (needsMinecraftNickname(currentUser)) {
                router.replace(`/profile/nickname?returnUrl=${encodeURIComponent("/profile/get-pass")}`);
                return;
            }

            setUser(currentUser);
            setIsLoading(false);
        };

        loadUser();
    }, [router]);

    if (isLoading || !user) {
        return <Loader />;
    }

    return (
        <ProtectedForm userId={user.id}>
            {alertMessage && (
                <Alert Success={alertSuccess} Color={alertColor}>
                    {alertMessage}
                </Alert>
            )}
            <FormPass />
        </ProtectedForm>
    );
}
