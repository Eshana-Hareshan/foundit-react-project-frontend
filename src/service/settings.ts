
import api from "./api";

export interface PlatformSettings {
    _id?: string;
    platformName: string;
    description: string;
    registrationEnabled: boolean;
    emailVerification: boolean;
}

export const getSettings = async () => {
    const response = await api.get("/admin/settings");
    return response.data;
};

export const updateSettings = async (
    settings: PlatformSettings
) => {
    const response = await api.put(
        "/admin/settings",
        settings
    );

    return response.data;
};
