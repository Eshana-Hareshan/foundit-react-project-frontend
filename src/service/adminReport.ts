
import api from "./api";

export const getAllReports = async (status?: string) => {
    const response = await api.get("/admin/reports", {
        params: status ? { status } : {}
    });

    return response.data;
};


export const reviewReport = async (
    reportId: string,
    action: "DISMISS" | "REQUEST_EDIT" | "RESTRICT" | "REMOVE",
    adminNote: string
) => {
    const response = await api.patch(
        `/admin/reports/${reportId}/review`,
        {
            action,
            adminNote
        }
    );

    return response.data;
};

