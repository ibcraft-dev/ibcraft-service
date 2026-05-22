import axios from "axios";
import api from "../api/api";

type AdminUser = {
    id: string;
    email: string;
    name: string;
    roles: string[];
};

const fetchAdminMe = async () => {
    try {
        const response = await api.get<AdminUser>("/api/admin/me");
        return { data: response.data, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { data: null, status: error.response.status };
        }

        console.error("Admin auth check failed:", error);
        return { data: null, status: 500 };
    }
};

const fetchAdminLogin = async (payload: { email: string; password: string }) => {
    try {
        const response = await api.post<AdminUser>("/api/admin/login", payload);
        return { data: response.data, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { data: null, status: error.response.status };
        }

        console.error("Admin login failed:", error);
        return { data: null, status: 500 };
    }
};

const fetchAdminLogout = async () => {
    try {
        const response = await api.post("/api/admin/logout");
        return { data: response.data, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { data: null, status: error.response.status };
        }

        console.error("Admin logout failed:", error);
        return { data: null, status: 500 };
    }
};

export type { AdminUser };
export { fetchAdminLogin, fetchAdminLogout, fetchAdminMe };
