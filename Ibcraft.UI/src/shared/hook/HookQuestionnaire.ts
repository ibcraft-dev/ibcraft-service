import axios from "axios";
import api from "../api/api";

type QuesionnaireType = {
    age: number;
    playingTime: string;
    acceptRule: boolean;
    playingServer: boolean;
    licenseMinecraft: boolean;
    buildingLevel: number;
    adequacyLevel: number;
    description: string;
};

const fetchStatus = async (id: string) => {
    try {
        if (id === "") {
            return { data: null, status: null };
        }

        const response = await api.get(`/api/questionnaire/${id}/status`);
        return { data: response.data, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { data: null, status: error.response.status };
        }

        console.error("Network error:", error);
        return { data: null, status: 500 };
    }
};

const fetchSend = async (payload: QuesionnaireType) => {
    try {
        const post = await api.post("/api/questionnaire/create", payload);
        return { data: "Данные успешно отправлены", code: post.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { data: error.response.data, code: error.response.status };
        }

        console.error("Ошибка при отправке данных:", error);
        return { data: null, code: 500 };
    }
};

export { fetchStatus, fetchSend };
