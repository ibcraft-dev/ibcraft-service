import axios from "axios";
import api from "../api/api";
import Cookies from "js-cookie";
import { TypefetchRegister } from "./IUser";

const AUTH_STATE_CHANGED_EVENT = "auth-state-changed";

const notifyAuthStateChanged = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
    }
};

const fetchUser = async () => {
    try {
        const response = await api.get('/api/auth/get-me');
        return response.data;
    } catch (error) {
        console.log('Error fetching user:', error);
        return null;
    };
};

const fetchLogout = async () => {
    try {
        const response = await api.post('/api/auth/logout');
        notifyAuthStateChanged();
        return { data: response.data, status: response.status };
    } catch (error) {
        if(axios.isAxiosError(error) && error.response) {
            console.error('Error fetching logout:', error.response.data);
            return { data: null, status: error.response.status };
        } else {
            console.error('Network error:', error);
            return { data: null, status: 500 };
        }
    }
};

const fetchLogin = async (payload: { email: string, password: string }) => {
    try {
        const response = await api.post('/login', payload);
        return { data: response.data, status: response.status };
    } catch (error) {
        if(axios.isAxiosError(error) && error.response) {
            console.error('Error fetching login:', error.response.data);
            return { data: null, status: error.response.status };
        } else {
            console.error('Network error:', error);
            return { data: null, status: 500 };
        }
    }
};

const fetchForgotPassword = async (payload: { email: string }) => {
    try {
        const response = await api.post('/forgot', payload);
        return { data: response.data, status: response.status };
    } catch (error) {
        if(axios.isAxiosError(error) && error.response) {
            console.error('Error fetching:', error.response.data);
            return { data: null, status: error.response.status };
        } else {
            console.error('Network error:', error);
            return { data: null, status: 500 };
        }
    }
};

const fetchRegister = async (payload: TypefetchRegister) => {
   try {
    const response = await api.post("/register", payload);
    return { data: response.data, status: response.status}
   } catch (error) {
    if(axios.isAxiosError(error) && error.response) {
        console.error('Error fetching:', error.response.data);
        return { data: null, status: error.response.status };
    } else {
        console.error('Network error:', error);
        return { data: null, status: 500 };
    }
   }
}

const fetchConfirmUser = async (payload: {token: string, email: string}) => {
    try {
        const response = await api.put("/confirm-email", payload)
        return { data: response.data, status: response.status}
    } catch (error) {
        if(axios.isAxiosError(error) && error.response) {
            console.error('Error fetching:', error.response.data);
            return { data: null, status: error.response.status };
        } else {
            console.error('Network error:', error);
            return { data: null, status: 500 };
        }
    }
}

const fetctTokenReset = async (payload: {email: string, token: string}) => {
    try {
        const response = await api.post("/reset-token", payload);
        return { data: response.data, status: response.status}
    } catch (error) {
        if(axios.isAxiosError(error) && error.response) {
            console.error('Error fetching:', error.response.data);
            return { data: null, status: error.response.status };
        } else {
            console.error('Network error:', error);
            return { data: null, status: 500 };
        }
    }
}

const fetchResetPassword = async (payload: {token: string, newPassword: string, confirmPassword: string}) => {  
    try {
        const response = await api.put("/reset", payload);
        return { data: response.data, status: response.status}
    } catch (error) {
        if(axios.isAxiosError(error) && error.response) {
            console.error('Error fetching:', error.response.data);
            return { data: null, status: error.response.status };
        } else {
            console.error('Network error:', error);
            return { data: null, status: 500 };
        }
    }
}

const fetchCheckToken = async () => {
    try {
        const response = await api.get('/chack-token')
        console.log('Server response:', response.data);
        return { data: response.data, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.log('Ошибка запроса:', error.response.data.error); 
            console.log('Сообщение:', error.response.data.message);
            Cookies.remove("dragonkey");
            return { data: null, status: error.response.status };
        } else {
            console.error('Ошибка сети:', error);
            Cookies.remove("dragonkey");
            return { data: null, status: 500 };
        }    
    }
};

const fetchUpdateUserAvatar = async (payload: {file: FormData}) => {
    try {
        const response = await api.put('/api/auth/update-avatar', payload.file,
            {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            },
            
        );
        return { data: response.data, status: response.status }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.log('Ошибка запроса:', error.response.data.error); 
            console.log('Сообщение:', error.response.data.message);
            return { data: null, status: error.response.status };
        } else {
            console.error('Ошибка сети:', error);
            return { data: null, status: 500 };
        } 
    }   
}

const fetchUpdateNikname = async (payload: { newNikname: string }) => {
    try {
        const response = await api.put('/api/auth/nikname-update', payload);
        return { data: response.data, status: response.status };
    } catch (error) {
        if(axios.isAxiosError(error) && error.response) {
            console.error('Error fetching:', error.response.data);
            return { data: null, status: error.response.status };
        } else {
            console.error('Network error:', error);
            return { data: null, status: 500 };
        }
    }
};

const googleAuth = () => {
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL_HTTP ?? "";
    const normalizedApiUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    const returnUrl = encodeURIComponent(window.location.origin);

    window.location.href = normalizedApiUrl + "/api/auth/google?returnUrl=" + returnUrl;
}

export  { 
    fetchUser, 
    fetchLogin, 
    fetchCheckToken, 
    fetchRegister, 
    fetchConfirmUser, 
    fetchForgotPassword, 
    fetctTokenReset, 
    fetchResetPassword, 
    fetchUpdateUserAvatar, 
    fetchUpdateNikname,
    fetchLogout,
    AUTH_STATE_CHANGED_EVENT,
    googleAuth };

