"use client";

import { useAlert } from "@components/alert/alertContext";
import Alert from "@components/alert/succesAlert";
import { useAuth } from "@components/Auth/AuthContext";
import ProtectedRoute from "@components/Auth/ProtectedRoute";
import BubbleControler from "@components/EffectComponents/BubbleControler";
import FormPass from "@components/forms/formspass";
import ProtectedForm from "@components/forms/ProtectedForm";



export default function GetPenetrationPage() {
    BubbleControler();
    const { alertMessage, alertColor, alertSuccess } = useAlert();
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <ProtectedForm userId={user?.id}>
                <>
                {alertMessage && (
                    <Alert Success={alertSuccess} Color={alertColor}>
                        {alertMessage}
                    </Alert>
                )}
                    <FormPass />
                </>
            </ProtectedForm>
        </ProtectedRoute>
    )
}