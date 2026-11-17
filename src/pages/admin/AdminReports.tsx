
import { useEffect, useState } from "react";
import { Flag, Search } from "lucide-react";
import {
    getAllReports,
    reviewReport
} from "../../service/adminReport";

interface Report {
    _id: string;
    itemId: {
        _id: string;
        itemName: string;
    } | null;
    reporterId: {
        _id: string;
        name: string;
        email: string;
    } | null;
    ownerId: {
        _id: string;
        name: string;
        email: string;
    } | null;
    reason: string;
    description: string;
    status: "PENDING" | "REVIEWED" | "DISMISSED" | "ACTION_TAKEN";
    createdAt: string;
}

type ReviewAction =
    | "DISMISS"
    | "REQUEST_EDIT"
    | "RESTRICT"
    | "REMOVE";

const AdminReports = () => {

    const [search, setSearch] = useState("");
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Report review states
    const [selectedReport, setSelectedReport] =
        useState<Report | null>(null);

    const [selectedAction, setSelectedAction] =
        useState<ReviewAction>("DISMISS");

    const [adminNote, setAdminNote] = useState("");

    const [submittingReview, setSubmittingReview] = useState(false);

    // Fetch reports from MongoDB
    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getAllReports();

                setReports(response.data || []);

            } catch (err: any) {
                console.error("Failed to fetch reports:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load reports."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    // Search reports
    const filteredReports = reports.filter((report) =>
        (report.reporterId?.name || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        (report.itemId?.itemName || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        report.reason.toLowerCase().includes(search.toLowerCase())
    );

    // Display readable status
    const getStatusLabel = (status: Report["status"]) => {
        const labels = {
            PENDING: "Pending",
            REVIEWED: "Reviewed",
            DISMISSED: "Dismissed",
            ACTION_TAKEN: "Action Taken"
        };

        return labels[status];
    };

    // Status colors
    const getStatusStyle = (status: Report["status"]) => {
        switch (status) {
            case "PENDING":
                return "bg-orange-100 text-orange-700";

            case "REVIEWED":
                return "bg-blue-100 text-blue-700";

            case "DISMISSED":
                return "bg-gray-100 text-gray-700";

            case "ACTION_TAKEN":
                return "bg-green-100 text-green-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Submit Admin review
    const handleReviewReport = async () => {

        if (!selectedReport) return;

        if (!adminNote.trim()) {
            alert("Please provide an Admin note.");
            return;
        }

        try {
            setSubmittingReview(true);

            await reviewReport(
                selectedReport._id,
                selectedAction,
                adminNote
            );

            // Update report status on screen
            setReports((previousReports) =>
                previousReports.map((report) =>
                    report._id === selectedReport._id
                        ? {
                            ...report,
                            status:
                                selectedAction === "DISMISS"
                                    ? "DISMISSED"
                                    : "ACTION_TAKEN"
                        }
                        : report
                )
            );

            alert("Report reviewed successfully.");

            // Clear review form
            setSelectedReport(null);
            setAdminNote("");
            setSelectedAction("DISMISS");

        } catch (error: any) {
            console.error("Report review error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to review report."
            );

        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div className="space-y-6">

            {/* Heading */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Reports Management
                </h1>

                <p className="text-gray-500 mt-2">
                    Review reports submitted by Foundit users.
                </p>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">

                <div className="relative max-w-md">

                    <Search
                        size={20}
                        className="absolute left-3 top-3 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search reports..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                <div className="p-5 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-800">
                        Submitted Reports ({filteredReports.length})
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Loading reports...
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">
                        {error}
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="bg-gray-50 text-gray-500 text-sm">
                                <tr>
                                    <th className="p-4">Reported By</th>
                                    <th className="p-4">Item</th>
                                    <th className="p-4">Reason</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {filteredReports.map((report) => (
                                    <tr key={report._id}>

                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Flag
                                                    size={16}
                                                    className="text-orange-500"
                                                />

                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {report.reporterId?.name || "Unknown User"}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {report.reporterId?.email || ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 text-gray-600">
                                            {report.itemId?.itemName || "Item unavailable"}
                                        </td>

                                        <td className="p-4 text-gray-600">
                                            {report.reason.replaceAll("_", " ")}
                                        </td>

                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(report.status)}`}>
                                                {getStatusLabel(report.status)}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4">

                                            {report.status === "PENDING" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedReport(report);
                                                        setSelectedAction("DISMISS");
                                                        setAdminNote("");
                                                    }}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                                >
                                                    Review
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm">
                                                    Reviewed
                                                </span>
                                            )}

                                        </td>

                                    </tr>
                                ))}

                                {filteredReports.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            No reports found.
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* Report Review Form */}
            {selectedReport && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">

                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Review Report
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Reported item: {selectedReport.itemId?.itemName || "Item unavailable"}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            Reported by: {selectedReport.reporterId?.name || "Unknown User"}
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                            Description: {selectedReport.description}
                        </p>
                    </div>

                    {/* Select Action */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Action
                        </label>

                        <select
                            value={selectedAction}
                            onChange={(e) =>
                                setSelectedAction(e.target.value as ReviewAction)
                            }
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="DISMISS">
                                Dismiss Report
                            </option>

                            <option value="REQUEST_EDIT">
                                Request Post Owner to Edit
                            </option>

                            <option value="RESTRICT">
                                Restrict Post
                            </option>

                            <option value="REMOVE">
                                Remove Post
                            </option>
                        </select>
                    </div>

                    {/* Admin Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Note / Reason
                        </label>

                        <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Explain why you are taking this action..."
                            rows={4}
                            maxLength={1000}
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <p className="text-xs text-gray-400 text-right">
                            {adminNote.length}/1000
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end">

                        <button
                            type="button"
                            onClick={() => {
                                setSelectedReport(null);
                                setAdminNote("");
                                setSelectedAction("DISMISS");
                            }}
                            disabled={submittingReview}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleReviewReport}
                            disabled={submittingReview || !adminNote.trim()}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submittingReview
                                ? "Submitting..."
                                : "Submit Decision"}
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
};

export default AdminReports;
