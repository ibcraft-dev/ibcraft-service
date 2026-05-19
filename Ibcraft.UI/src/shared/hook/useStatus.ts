import { useEffect, useState } from "react";
import { fetchStatus } from "./HookQuestionnaire";

export function useStatus(userId: string) {
    const [status, setStatus] = useState<string | null>(null);
    const statusResponse = async () => {
        try {
             const response = await fetchStatus(userId)
             if (response.status !== 200) {
                 return;
             } 

             setStatus(response.data);
        } catch (error) {
             setStatus("error")
        }
     }
    
    useEffect(() => {
        statusResponse();
    }, [userId]);

    return status

}