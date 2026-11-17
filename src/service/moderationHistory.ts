
import api from "./api";

export const getModerationHistory = async (
    page: number = 1,
    limit: number = 10
) => {
    const response = await api.get("/admin/moderation-history", {
        params: {
            page,
            limit
        }
    });

    return response.data;
};
