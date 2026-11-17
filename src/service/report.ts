
import api from "./api";

export interface CreateReportData {
    reason: string;
    description: string;
}

export const createReport = async (
    itemId: string,
    reportData: CreateReportData
) => {
    const response = await api.post(
        `/reports/${itemId}`,
        reportData
    );

    return response.data;
};
