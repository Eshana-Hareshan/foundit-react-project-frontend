
import axios, {
    AxiosError,
    type InternalAxiosRequestConfig
} from "axios";

import { refreshTokenCall } from "./auth";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _isRefresh?: boolean;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

// Authentication endpoints that do not require authentication
const PUBLIC_ENDPOINTS = [
    "/auth/login",
    "/auth/register",
    "/auth/verify-otp",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/refresh",
    "/auth/google"
];

// Check whether the request is for a public endpoint
const isPublicEndpoint = (
    url?: string,
    method?: string
): boolean => {
    if (!url) return false;

    const requestMethod = method?.toLowerCase();

    // Public authentication endpoints
    const isPublicAuth = PUBLIC_ENDPOINTS.some((endpoint) =>
        url.includes(endpoint)
    );

    // Public item reading endpoints
    const isPublicItemRead =
        requestMethod === "get" &&
        (url === "/items" || url.startsWith("/items/"));

    // Public settings endpoint
    const isPublicSettings =
        requestMethod === "get" &&
        url === "/admin/settings/public";

    return (
        isPublicAuth ||
        isPublicItemRead ||
        isPublicSettings
    );
};

// REQUEST INTERCEPTOR
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("ACCESS_TOKEN");

        const isPublic = isPublicEndpoint(
            config.url,
            config.method
        );

        // Attach access token only to protected requests
        if (token && !isPublic) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest =
            error.config as CustomAxiosRequestConfig | undefined;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const isPublic = isPublicEndpoint(
            originalRequest.url,
            originalRequest.method
        );

        // Refresh only when a protected request returns 401
        if (
            error.response?.status === 401 &&
            !originalRequest._isRefresh &&
            !isPublic
        ) {
            originalRequest._isRefresh = true;

            try {
                const refreshToken =
                    localStorage.getItem("REFRESH_TOKEN");

                if (!refreshToken) {
                    throw new Error("Refresh token not found.");
                }

                // Request a new access token
                const refreshResponse =
                    await refreshTokenCall(refreshToken);

                const newAccessToken =
                    refreshResponse.data.accessToken;

                if (!newAccessToken) {
                    throw new Error("New access token was not returned.");
                }

                // Save the new access token
                localStorage.setItem(
                    "ACCESS_TOKEN",
                    newAccessToken
                );

                // Update the original request
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                // Retry using the configured Axios instance
                return api(originalRequest);

            } catch (refreshError) {
                // Remove invalid authentication tokens
                localStorage.removeItem("ACCESS_TOKEN");
                localStorage.removeItem("REFRESH_TOKEN");

                console.error(
                    "Token refresh failed:",
                    refreshError
                );

                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
