
import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Sparkles,
  CheckCheck,
  ExternalLink,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../service/notification";

interface PopulatedItem {
  _id: string;
  itemName: string;
  status: string;
  imageUrl?: string;
  category?: string;
  location?: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  itemId?: PopulatedItem | null;
  lostItemId?: PopulatedItem | null;
  foundItemId?: PopulatedItem | null;
  matchScore?: number;
  matchExplanation?: string;
  matchingDetails?: string[];
  conflictingDetails?: string[];
}

export default function NotificationBell() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

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

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);

      await markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }

    const targetItemId =
      notification.foundItemId?._id ||
      notification.itemId?._id ||
      notification.lostItemId?._id;

    if (targetItemId) {
      navigate(`/items/${targetItemId}`);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/40 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 mb-6 font-medium"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Main Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">

          {/* Header */}
          <div className="p-6 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Bell size={24} className="text-emerald-700" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-emerald-950">
                  Notifications
                </h1>

                <p className="text-sm text-slate-500">
                  Stay updated about your lost and found items.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">

              {unreadCount > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full">
                  {unreadCount} Unread
                </span>
              )}

              <button
                onClick={fetchNotifications}
                disabled={loading}
                title="Refresh notifications"
                className="p-2 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markingAll}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  <CheckCheck size={15} />
                  {markingAll ? "Marking..." : "Mark all as read"}
                </button>
              )}

            </div>
          </div>

          {/* Notification List */}
          <div className="divide-y divide-slate-100">

            {loading ? (
              <div className="p-12 text-center text-slate-500">
                <RefreshCw size={28} className="mx-auto mb-3 animate-spin text-emerald-600" />
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell size={42} className="mx-auto text-slate-300 mb-3" />

                <h2 className="text-lg font-semibold text-slate-800">
                  No notifications yet
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  We will notify you when matching items are found.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const isMatch =
                  notification.type === "ITEM_MATCH_FOUND";

                const matchedItem =
                  notification.foundItemId || notification.itemId;

                return (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-5 sm:p-6 flex gap-4 cursor-pointer transition-colors hover:bg-emerald-50/50 ${
                      notification.isRead
                        ? "bg-white"
                        : isMatch
                        ? "bg-amber-50/40"
                        : "bg-blue-50/40"
                    }`}
                  >

                    {/* Notification Icon */}
                    <div className="shrink-0">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center ${
                          isMatch
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {isMatch ? (
                          <Sparkles size={20} />
                        ) : (
                          <AlertTriangle size={20} />
                        )}
                      </div>
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">

                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          {notification.title}
                        </h3>

                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}

                        {isMatch &&
                          typeof notification.matchScore === "number" && (
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                notification.matchScore >= 80
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {notification.matchScore}% Match
                            </span>
                          )}
                      </div>

                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                        {notification.message}
                      </p>

                      {/* AI Explanation */}
                      {notification.matchExplanation && (
                        <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                          <p className="text-xs font-semibold text-amber-900 mb-1">
                            AI Matching Explanation
                          </p>

                          <p className="text-sm text-amber-900/80">
                            {notification.matchExplanation}
                          </p>
                        </div>
                      )}

                      {/* Matching Details */}
                      {notification.matchingDetails &&
                        notification.matchingDetails.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-emerald-800 mb-1">
                              Matching details
                            </p>

                            <ul className="list-disc pl-5 text-sm text-slate-600">
                              {notification.matchingDetails.map((detail, index) => (
                                <li key={index}>{detail}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Conflicting Details */}
                      {notification.conflictingDetails &&
                        notification.conflictingDetails.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-rose-700 mb-1">
                              Details to verify
                            </p>

                            <ul className="list-disc pl-5 text-sm text-slate-600">
                              {notification.conflictingDetails.map((detail, index) => (
                                <li key={index}>{detail}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Matched Item Preview */}
                      {matchedItem && (
                        <div className="mt-4 p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-3">

                          {matchedItem.imageUrl ? (
                            <img
                              src={matchedItem.imageUrl}
                              alt={matchedItem.itemName}
                              className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center">
                              <Bell size={22} className="text-slate-400" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-800 text-sm">
                              {matchedItem.itemName}
                            </h4>

                            {matchedItem.category && (
                              <p className="text-xs text-slate-500 mt-1">
                                Category: {matchedItem.category}
                              </p>
                            )}

                            {matchedItem.location && (
                              <p className="text-xs text-slate-500 mt-1">
                                Location: {matchedItem.location}
                              </p>
                            )}
                          </div>

                          <ExternalLink
                            size={18}
                            className="text-emerald-600 shrink-0"
                          />
                        </div>
                      )}

                      <p className="text-xs text-slate-400 mt-3">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>

                    </div>

                    {/* Mark as Read */}
                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification._id);
                        }}
                        title="Mark as read"
                        className="shrink-0 self-start p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-100"
                      >
                        <Check size={18} />
                      </button>
                    )}

                  </div>
                );
              })
            )}

          </div>

          {/* Footer */}
          {!loading && notifications.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                You have {notifications.length} notification
                {notifications.length !== 1 ? "s" : ""}.
                AI suggestions do not confirm item ownership.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
