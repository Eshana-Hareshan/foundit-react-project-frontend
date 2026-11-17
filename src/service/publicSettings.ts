
import api from "./api";

export interface PublicSettings {
    platformName: string;
    description: string;
}

export const getPublicSettings = async () => {
    const response = await api.get("/admin/settings/public");
    return response.data;
};
