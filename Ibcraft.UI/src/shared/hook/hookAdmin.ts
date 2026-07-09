import axios from "axios";
import api from "../api/api";

type AdminUser = {
    id: string;
    email: string;
    name: string;
    roles: string[];
};

type AdminManagedUser = {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    emailVerified: boolean;
    role: string;
    roles: string[];
    isBanned: boolean;
};

type AdminUpdateUserPayload = {
    nickname: string;
    email: string;
    emailConfirmed: boolean;
    role: string;
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

const fetchAdminUsers = async (search?: string) => {
    try {
        const response = await api.get<AdminManagedUser[]>("/api/admin/users", {
            params: search ? { search } : undefined,
        });
        return { data: response.data, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { data: null, status: error.response.status };
        }

        console.error("Admin users fetch failed:", error);
        return { data: null, status: 500 };
    }
};

const updateAdminUser = async (id: string, payload: AdminUpdateUserPayload) => {
    try {
        const response = await api.put<AdminManagedUser>(`/api/admin/users/${id}`, payload);
        return { data: response.data, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { data: null, status: error.response.status };
        }

        console.error("Admin user update failed:", error);
        return { data: null, status: 500 };
    }
};

const updateAdminUserPassword = async (id: string, password: string, confirmPassword: string) => {
    try {
        const response = await api.patch(`/api/admin/users/${id}/password`, {
            password,
            confirmPassword,
        });
        return { data: response.data, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { data: null, status: error.response.status };
        }

        console.error("Admin user password update failed:", error);
        return { data: null, status: 500 };
    }
};

const toggleAdminUserBan = async (id: string, isBanned: boolean) => {
    try {
        const response = await api.patch<AdminManagedUser>(`/api/admin/users/${id}/ban`, {
            isBanned,
        });
        return { data: response.data, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { data: null, status: error.response.status };
        }

        console.error("Admin user ban toggle failed:", error);
        return { data: null, status: 500 };
    }
};

const deleteAdminUser = async (id: string) => {
    try {
        const response = await api.delete(`/api/admin/users/${id}`);
        return { data: response.data, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { data: null, status: error.response.status };
        }

        console.error("Admin user delete failed:", error);
        return { data: null, status: 500 };
    }
};

export type { AdminManagedUser, AdminUpdateUserPayload, AdminUser };
export {
    deleteAdminUser,
    fetchAdminLogin,
    fetchAdminLogout,
    fetchAdminMe,
    fetchAdminUsers,
    toggleAdminUserBan,
    updateAdminUser,
    updateAdminUserPassword,
};
