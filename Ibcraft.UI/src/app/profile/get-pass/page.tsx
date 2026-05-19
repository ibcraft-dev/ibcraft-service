"use client";

import { useAlert } from "@components/alert/alertContext";
import Alert from "@components/alert/succesAlert";
import BubbleControler from "@components/EffectComponents/BubbleControler";
import FormPass from "@components/forms/formspass";
import ProtectedForm from "@components/forms/ProtectedForm";



export default function GetPenetrationPage() {
    BubbleControler();
    const { alertMessage, alertColor, alertSuccess } = useAlert();


    return (

        <>
        {alertMessage && (
            <Alert Success={alertSuccess} Color={alertColor}>
                {alertMessage}
            </Alert>
        )}
            <FormPass />
        </>

    )
}