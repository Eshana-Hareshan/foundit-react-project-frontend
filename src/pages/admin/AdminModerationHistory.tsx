
import { useEffect, useState } from "react";
import {
    History,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import { getModerationHistory } from "../../service/moderationHistory";

interface ModerationRecord {
    _id: string;

    adminId?: {
        name: string;
        email: string;
    };

    itemId?: {
        _id: string;
        itemName: string;
        status: string;
    };

    targetUserId?: {
        _id: string;
        name: string;
        email: string;
    };

    reportId?: {
        reason: string;
        status: string;
    };

    action: string;
    reason: string;
    source: string;
    createdAt: string;
}

interface PaginationInfo {
    currentPage: number;
    totalRecords: number;
    totalPages: number;
    limit: number;
}

const AdminModerationHistory = () => {

    const [history, setHistory] = useState<ModerationRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalRecords: 0,
        totalPages: 0,
        limit: 10
    });

    // Fetch history whenever the page changes
    useEffect(() => {

        const fetchHistory = async () => {

            try {
                setLoading(true);
                setError("");

                const response = await getModerationHistory(
                    currentPage,
                    10
                );

                setHistory(response.data);

                setPagination(response.pagination);

                // Return to the last available page if the current page is invalid
                if (
                    response.pagination.totalPages > 0 &&
                    currentPage > response.pagination.totalPages
                ) {
                    setCurrentPage(response.pagination.totalPages);
                }

            } catch (error) {

                console.error("Moderation history error:", error);

                setError("Unable to load moderation history.");

            } finally {
                setLoading(false);
            }
        };

        fetchHistory();

    }, [currentPage]);

    // Action badge colors
    const getActionColor = (action: string) => {

        switch (action) {

            case "REQUEST_EDIT":
                return "bg-yellow-100 text-yellow-700";

            case "RESTRICT":
                return "bg-orange-100 text-orange-700";

            case "REMOVE":
                return "bg-red-100 text-red-700";

            case "RESTORE":
                return "bg-green-100 text-green-700";

            case "SUSPEND_USER":
                return "bg-red-100 text-red-700";

            case "REACTIVATE_USER":
                return "bg-green-100 text-green-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Display readable action names
    const getActionName = (action: string) => {

        const actionNames: Record<string, string> = {
            REQUEST_EDIT: "Request Edit",
            RESTRICT: "Restrict",
            REMOVE: "Remove",
            RESTORE: "Restore",
            SUSPEND_USER: "Suspend User",
            REACTIVATE_USER: "Reactivate User"
        };

        return actionNames[action] || action;
    };

    // Display readable source names
    const getSourceName = (source: string) => {

        switch (source) {

            case "ITEM_MANAGEMENT":
                return "Item Management";

            case "REPORT_REVIEW":
                return "Report Review";

            case "USER_MANAGEMENT":
                return "User Management";

            default:
                return source;
        }
    };

    // Display item or target user
    const getTargetName = (record: ModerationRecord) => {

        if (record.targetUserId) {

            return (
                <div>
                    <p className="font-medium text-gray-700">
                        {record.targetUserId.name || "Unknown User"}
                    </p>

                    <p className="text-xs text-gray-400">
                        {record.targetUserId.email || ""}
                    </p>
                </div>
            );
        }

        if (record.itemId) {
            return record.itemId.itemName;
        }

        return "Deleted item or user";
    };

    // Go to previous page
    const handlePreviousPage = () => {

        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Go to next page
    const handleNextPage = () => {

        if (currentPage < pagination.totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (loading) {

        return (
            <div className="flex justify-center items-center py-20 text-gray-500">
                <Loader2 className="animate-spin mr-2" />
                Loading moderation history...
            </div>
        );
    }

    if (error) {

        return (
            <div className="bg-red-50 text-red-600 p-5 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
            </div>
        );
    }

    return (

        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <History size={26} />
                    Moderation History
                </h1>

                <p className="text-gray-500 mt-2">
                    Review previous administrator moderation and account management actions.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                {history.length === 0 ? (

                    <div className="text-center py-16">

                        <History size={40} className="mx-auto text-gray-300" />

                        <h3 className="text-lg font-semibold text-gray-700 mt-4">
                            No Moderation History
                        </h3>

                        <p className="text-gray-500 mt-2">
                            No moderation actions have been recorded yet.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="bg-gray-50 border-b border-gray-200">

                                <tr>

                                    <th className="p-4 text-sm font-semibold text-gray-600">
                                        Action
                                    </th>

                                    <th className="p-4 text-sm font-semibold text-gray-600">
                                        Target
                                    </th>

                                    <th className="p-4 text-sm font-semibold text-gray-600">
                                        Admin
                                    </th>

                                    <th className="p-4 text-sm font-semibold text-gray-600">
                                        Reason
                                    </th>

                                    <th className="p-4 text-sm font-semibold text-gray-600">
                                        Source
                                    </th>

                                    <th className="p-4 text-sm font-semibold text-gray-600">
                                        Date
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {history.map((record) => (

                                    <tr
                                        key={record._id}
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="p-4">

                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(record.action)}`}>
                                                {getActionName(record.action)}
                                            </span>

                                        </td>

                                        <td className="p-4 text-sm text-gray-700">
                                            {getTargetName(record)}
                                        </td>

                                        <td className="p-4 text-sm text-gray-700">

                                            {record.adminId?.name || "Unknown Admin"}

                                            <p className="text-xs text-gray-400">
                                                {record.adminId?.email || ""}
                                            </p>

                                        </td>

                                        <td className="p-4 text-sm text-gray-600 max-w-xs">
                                            {record.reason}
                                        </td>

                                        <td className="p-4 text-sm text-gray-600">
                                            {getSourceName(record.source)}
                                        </td>

                                        <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(record.createdAt).toLocaleString()}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* Pagination information and buttons */}
            {pagination.totalRecords > 0 && (

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

                    <div className="text-sm text-gray-500">

                        Showing page{" "}
                        <strong>{pagination.currentPage}</strong>
                        {" "}of{" "}
                        <strong>{pagination.totalPages}</strong>

                        <span className="ml-2">
                            (Total records: {pagination.totalRecords})
                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1 || loading}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                            Previous
                        </button>

                        <span className="text-sm font-semibold text-gray-700">
                            {currentPage}
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={
                                currentPage >= pagination.totalPages ||
                                loading
                            }
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight size={18} />
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminModerationHistory;
