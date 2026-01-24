import { useStatus } from "@hooks/useStatus";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Loader from "../Loader";


export default function ProtectedForm({children, userId} : {children: ReactNode, userId?: string}) {
    const router = useRouter();

    const [statusForm, setStatusForm] = useState<boolean | undefined>();
    const status = useStatus(userId ?? "");

    useEffect(() => {
        
        if (status === null) {
            setStatusForm(false);
        } else if ( status !== "Unfiled") {
            router.push("/profile");
            console.log(status) 
        }

        setStatusForm(true);

    }, [status])

    if (statusForm === undefined) return <div><Loader /></div>

    return (
        <>
            {statusForm ? children : <div><Loader /></div>}
        </>
    )
}