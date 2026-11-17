import axios from "axios";
import api from "./api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", {
        email,
        password
    });
    return res.data;
};

export const googleLogin = async (credential: string) => {
    const res = await api.post("/auth/google", {
        credential
    });
    return res.data;
};

export const getMyDetails = async () => {
    const res = await api.get("/auth/me");
    return res.data;
};

export const register = async (
    name: string,
    email: string,
    password: string
) => {
    const res = await api.post("/auth/register", {
        name,
        email,
        password
    });
    return res.data;
};

export const verifyOTP = async (email: string, otp: string) => {
    const res = await api.post("/auth/verify-otp", {
        email,
        otp
    });
    return res.data;
};

export const forgotPassword = async (email: string) => {
    const res = await api.post("/auth/forgot-password", {
        email
    });
    return res.data;
};

export const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string
) => {
    const res = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword
    });
    return res.data;
};

export const refreshTokenCall = async (refreshToken: string) => {
    const res = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken
    });
    return res.data;
};
