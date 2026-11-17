
import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import {
    getMyNotifications,
    markNotificationAsRead
} from "../../service/notification";

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    itemId?: {
        _id: string;
        itemName: string;
        status: string;
    } | null;
}

const NotificationBell = () => {

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const response = await getMyNotifications();

            setNotifications(response.data || []);
            setUnreadCount(response.unreadCount || 0);

        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markNotificationAsRead(notificationId);

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification._id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );

            setUnreadCount((previous) => Math.max(0, previous - 1));

        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    return (
        <div className="relative">

            {/* Notification Button */}
            <button
                onClick={() => {
                    const nextState = !isOpen;
                    setIsOpen(nextState);

                    if (nextState) {
                        fetchNotifications();
                    }
                }}
                className="relative p-2 rounded-full hover:bg-gray-100"
                title="Notifications"
            >
                <Bell size={22} className="text-gray-700" />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            {isOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-lg">

                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-800">
                            Notifications
                        </h2>

                        <span className="text-xs text-gray-500">
                            {unreadCount} unread
                        </span>
                    </div>

                    <div className="max-h-96 overflow-y-auto">

                        {loading ? (
                            <p className="p-6 text-center text-gray-500">
                                Loading notifications...
                            </p>
                        ) : notifications.length === 0 ? (
                            <p className="p-6 text-center text-gray-500">
                                No notifications yet.
                            </p>
                        ) : (
                            notifications.map((notification) => (

                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-gray-100 ${
                                        notification.isRead
                                            ? "bg-white"
                                            : "bg-blue-50"
                                    }`}
                                >

                                    <div className="flex justify-between gap-3">

                                        <div>
                                            <h3 className="font-medium text-gray-800 text-sm">
                                                {notification.title}
                                            </h3>

                                            <p className="text-sm text-gray-600 mt-1">
                                                {notification.message}
                                            </p>

                                            {notification.itemId && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Post: {notification.itemId.itemName}
                                                </p>
                                            )}

                                            <p className="text-xs text-gray-400 mt-2">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        {!notification.isRead && (
                                            <button
                                                onClick={() =>
                                                    handleMarkAsRead(notification._id)
                                                }
                                                title="Mark as read"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Check size={18} />
                                            </button>
                                        )}

                                    </div>

                                </div>
                            ))
                        )}

                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full p-3 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Close
                    </button>

                </div>
            )}

        </div>
    );
};

export default NotificationBell;
