
import api from "./api";

// Get Admin dashboard information
export const getAdminDashboard = async () => {
    const response = await api.get("/admin/dashboard");

    return response.data;
};

// Get all users with optional search
export const getAllUsers = async (search: string = "") => {
    const response = await api.get("/admin/users", {
        params: { search }
    });

    return response.data;
};

// Get all items for Admin with optional search and moderation filter
export const getAllAdminItems = async (
    search: string = "",
    moderationStatus: string = "ALL"
) => {
    const response = await api.get("/admin/items", {
        params: {
            search,
            moderationStatus
        }
    });

    return response.data;
};


// Perform an Admin moderation action on an item
export const moderateItem = async (
    itemId: string,
    action: "REQUEST_EDIT" | "RESTRICT" | "REMOVE" | "RESTORE",
    reason: string
) => {
    const response = await api.patch(
        `/admin/items/${itemId}/moderation`,
        {
            action,
            reason
        }
    );

    return response.data;
};

export const updateUserSuspension = async (
    userId: string,
    isSuspended: boolean
) => {
    const response = await api.patch(
        `/admin/users/${userId}/suspension`,
        { isSuspended }
    );

    return response.data;
};
