import { useEffect, useState } from "react";
import SubmitButton from "../Buttons/SubmitButton";
import { useStatus } from "@hooks/useStatus";

interface ButtonQuestionnaireLinkProps {
    Id?: string;
}

export default function ButtonQuestionnaireLink({ Id }: ButtonQuestionnaireLinkProps) {
    const [disabledBtn, setDisabledBtn] = useState<boolean>(true);
    var status = useStatus(Id ?? "");
    
    useEffect(() => {
        if (status === "Unfiled" || status === null)
        {
            setDisabledBtn(false);
        } else {
            setDisabledBtn(true);
        }
        
    }, [status])

    return (
        <SubmitButton onClick={() => {}} disabled={disabledBtn} loading={false} icon={""} href="/profile/get-pass">Подать на получение проходки</SubmitButton>
    )
}