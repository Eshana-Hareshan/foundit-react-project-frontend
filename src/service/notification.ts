
import api from "./api";

// Get notifications belonging to the logged-in user
export const getMyNotifications = async () => {
    const response = await api.get("/notifications");
    return response.data;
};

// Mark a notification as read
export const markNotificationAsRead = async (
    notificationId: string
) => {
    const response = await api.patch(
        `/notifications/${notificationId}/read`
    );

    return response.data;
};