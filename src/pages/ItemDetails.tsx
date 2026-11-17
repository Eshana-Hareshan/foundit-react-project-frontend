import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    MapPin,
    Calendar,
    ArrowLeft,
    MessageCircle,
    Pencil,
    CheckCircle2,
    Loader2,
    PackageX,
    Info,
    LogIn,
    Flag,
    X
} from "lucide-react";
import api from "../service/api";
import { AuthContext } from "../context/AuthContext";
import { createConversation } from "../service/chat";
import {createReport} from "../service/report";

interface ItemDetailsType {
    _id: string;
    itemName: string;
    category: string;
    location: string;
    description: string;
    dateFound: string;
    additionalDetails?: string;
    imageUrl: string;
    isResolved?: boolean;
    status?: "LOST" | "FOUND";
    userId?: {
        _id: string;
        name: string;
        email: string;
    };
}

export default function ItemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const auth = useContext(AuthContext);
    const currentUser = auth?.user;

    const [startingChat, setStartingChat] = useState(false);
    const [chatError, setChatError] = useState("");

    const [resolving, setResolving] = useState(false);
    const [resolveError, setResolveError] = useState("");

    const [item, setItem] = useState<ItemDetailsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showReportForm, setShowReportForm] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportDescription, setReportDescription] = useState("");
    const [submittingReport, setSubmittingReport] = useState(false);
    const [reportMessage, setReportMessage] = useState("");
    const [reportError, setReportError] = useState("");

    const currentUserId = currentUser?.id || currentUser?._id;

    const isOwner =
        !!currentUserId &&
        !!item?.userId?._id &&
        item.userId._id === currentUserId;

    const handleSubmitReport = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!id || !reportReason || !reportDescription.trim()) {
            setReportError("Please select a reason and provide a description.");
            return;
        }

        try {
            setSubmittingReport(true);
            setReportError("");
            setReportMessage("");

            const response = await createReport(id, {
                reason: reportReason,
                description: reportDescription.trim()
            });

            setReportMessage(response.message);
            setReportReason("");
            setReportDescription("");
            setShowReportForm(false);

        } catch (error: any) {
            console.error("Report submission error:", error);

            setReportError(
                error.response?.data?.message ||
                "Unable to submit your report. Please try again."
            );
        } finally {
            setSubmittingReport(false);
        }
    };

    const handleStartChat = async () => {
        if (!id || !currentUser) return;

        try {
            setStartingChat(true);
            setChatError("");

            const conversation = await createConversation(id);

            navigate(`/chats?conversationId=${conversation._id}`);
        } catch (error) {
            console.error("Start Chat Error:", error);
            setChatError("Unable to start chat. Please try again.");
        } finally {
            setStartingChat(false);
        }
    };

    const handleMarkAsResolved = async () => {
        if (!id) return;

        const confirmed = window.confirm(
            "Have you successfully handed over this item?"
        );

        if (!confirmed) return;

        try {
            setResolving(true);
            setResolveError("");

            await api.patch(`/items/${id}/resolve`);

            setItem((previousItem) =>
                previousItem
                    ? { ...previousItem, isResolved: true }
                    : previousItem
            );
        } catch (error) {
            console.error("Resolve Item Error:", error);
            setResolveError("Unable to mark this item as resolved. Please try again.");
        } finally {
            setResolving(false);
        }
    };

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await api.get(`/items/${id}`);
                setItem(response.data.data);
            } catch (error) {
                console.error("Item Details Error:", error);
                setError("Unable to load item details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchItem();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 md:h-[calc(100dvh-9rem)] animate-pulse">
                <div className="bg-emerald-100/60 rounded-3xl h-64 md:h-full" />
                <div className="space-y-4">
                    <div className="h-6 w-28 bg-emerald-100/60 rounded-full" />
                    <div className="h-10 w-3/4 bg-emerald-100/60 rounded-xl" />
                    <div className="h-24 bg-emerald-100/60 rounded-xl" />
                    <div className="h-14 bg-emerald-100/60 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="max-w-md mx-auto text-center py-16 px-6 bg-white border border-dashed border-emerald-200 rounded-2xl">
                <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                    <PackageX size={26} />
                </div>
                <p className="font-bold text-emerald-950">{error || "Item not found."}</p>
                <Link
                    to="/items"
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to items
                </Link>
            </div>
        );
    }

    const isLost = item.status === "LOST";

    return (
        // On desktop (md+) the whole page is locked to the visible screen height.
        // Only the description box scrolls internally if the text is very long.
        <div className="max-w-5xl mx-auto md:h-[calc(100dvh-9rem)] md:flex md:flex-col">
            <Link
                to="/items"
                className="self-start inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
                <ArrowLeft size={16} />
                Back to items
            </Link>

            <div className="grid md:grid-cols-2 gap-5 lg:gap-8 md:flex-1 md:min-h-0">
                {/* ============ IMAGE ============ */}
                <div className="relative h-64 sm:h-80 md:h-full min-h-0">
                    <img
                        src={item.imageUrl}
                        alt={item.itemName}
                        className={`w-full h-full object-cover rounded-3xl border border-emerald-100 shadow-lg shadow-emerald-900/5 ${
                            item.isResolved ? "grayscale-[40%]" : ""
                        }`}
                    />

                    {item.status && (
                        <span
                            className={`absolute top-4 left-4 text-xs font-black tracking-wider px-3 py-1.5 rounded-full text-white shadow-md ${
                                isLost ? "bg-rose-600" : "bg-emerald-600"
                            }`}
                        >
                            {item.status}
                        </span>
                    )}

                    {item.isResolved && (
                        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-xs font-black tracking-wider px-3 py-1.5 rounded-full bg-white text-emerald-700 shadow-md">
                            <CheckCircle2 size={14} /> RESOLVED
                        </span>
                    )}
                </div>

                {/* ============ DETAILS ============ */}
                <div className="flex flex-col gap-3 md:min-h-0">
                    <div>
                        <span className="inline-block text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                            {item.category}
                        </span>

                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-950 mt-2 leading-tight">
                            {item.itemName}
                        </h1>
                    </div>

                    {/* Location & date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-emerald-100">
                            <div className="w-8 h-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <MapPin size={16} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/60">
                                    {isLost ? "Last seen" : "Found at"}
                                </p>
                                <p className="text-sm font-semibold text-slate-800 truncate" title={item.location}>
                                    {item.location}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-emerald-100">
                            <div className="w-8 h-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Calendar size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/60">
                                    {isLost ? "Date lost" : "Date found"}
                                </p>
                                <p className="text-sm font-semibold text-slate-800">
                                    {new Date(item.dateFound).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description (scrolls inside itself if very long) */}
                    <div className="md:flex-1 md:min-h-0 md:overflow-y-auto pr-1">
                        <h2 className="font-bold text-emerald-950 text-sm mb-1">Description</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                    </div>

                    {item.additionalDetails && (
                        <div className="flex gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100 max-h-24 overflow-y-auto">
                            <Info size={16} className="shrink-0 mt-0.5 text-amber-600" />
                            <div>
                                <h2 className="font-bold text-amber-900 text-xs mb-0.5">
                                    Additional details
                                </h2>
                                <p className="text-xs text-amber-900/80 leading-relaxed">
                                    {item.additionalDetails}
                                </p>
                            </div>
                        </div>
                    )}

                    {item.userId && (
                        <div className="bg-white border border-emerald-100 rounded-2xl p-4 space-y-3 shadow-sm">
                            {/* Posted by */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-white font-bold flex items-center justify-center">
                                    {(item.userId.name?.trim()?.[0] || "?").toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/60">
                                        Posted by
                                    </p>
                                    <p className="font-bold text-slate-900 leading-tight">{item.userId.name}</p>
                                </div>
                            </div>

                            {/* Owner actions (side by side to save height) */}
                            {isOwner && (
                                <div className="space-y-2 pt-3 border-t border-emerald-100">
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <Link
                                            to={`/items/${id}/edit`}
                                            className="flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all"
                                        >
                                            <Pencil size={16} />
                                            Edit
                                        </Link>

                                        {item.isResolved ? (
                                            <div className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-bold py-2.5 rounded-xl border border-emerald-200">
                                                <CheckCircle2 size={16} /> Resolved
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleMarkAsResolved}
                                                disabled={resolving}
                                                className="flex items-center justify-center gap-2 border-2 border-emerald-600 text-emerald-700 text-sm font-bold py-2.5 rounded-xl hover:bg-emerald-50 disabled:opacity-60 transition-colors"
                                            >
                                                {resolving ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <CheckCircle2 size={16} />
                                                )}
                                                {resolving ? "Marking..." : "Mark Resolved"}
                                            </button>
                                        )}
                                    </div>

                                    {resolveError && (
                                        <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                                            {resolveError}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Other users can start a chat */}
                            {currentUser && !isOwner && !item.isResolved && (
                                <div className="pt-3 border-t border-emerald-100">
                                    <button
                                        onClick={handleStartChat}
                                        disabled={startingChat}
                                        className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all disabled:opacity-60"
                                    >
                                        {startingChat ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <MessageCircle size={18} />
                                        )}
                                        {startingChat ? "Opening Chat..." : "Start Chat"}
                                    </button>

                                    {chatError && (
                                        <p className="mt-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                                            {chatError}
                                        </p>
                                    )}
                                    

                                    {/* Report Post */}
                                    {currentUser && !isOwner && (
                                        <div className="pt-3 border-t border-emerald-100 space-y-3">

                                            {!showReportForm ? (
                                                <button
                                                    onClick={() => {
                                                        setShowReportForm(true);
                                                        setReportError("");
                                                        setReportMessage("");
                                                    }}
                                                    className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-rose-600 py-2.5 rounded-xl hover:bg-rose-50 transition-colors"
                                                >
                                                    <Flag size={16} />
                                                    Report this post
                                                </button>
                                            ) : (
                                                <form
                                                    onSubmit={handleSubmitReport}
                                                    className="space-y-3 bg-rose-50 border border-rose-100 rounded-xl p-4"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-bold text-rose-900">
                                                            Report this post
                                                        </h3>

                                                        <button
                                                            type="button"
                                                            onClick={() => setShowReportForm(false)}
                                                            className="text-rose-500 hover:text-rose-700"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                                                            Reason for reporting
                                                        </label>

                                                        <select
                                                            value={reportReason}
                                                            onChange={(e) => setReportReason(e.target.value)}
                                                            required
                                                            className="w-full border border-rose-200 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-rose-300"
                                                        >
                                                            <option value="">Select a reason</option>
                                                            <option value="FRAUD">Fraud or scam</option>
                                                            <option value="FAKE_POST">Fake post</option>
                                                            <option value="INAPPROPRIATE_CONTENT">
                                                                Inappropriate content
                                                            </option>
                                                            <option value="WRONG_INFORMATION">
                                                                Incorrect information
                                                            </option>
                                                            <option value="DUPLICATE_POST">
                                                                Duplicate post
                                                            </option>
                                                            <option value="OTHER">Other</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                                                            Explain the problem
                                                        </label>

                                                        <textarea
                                                            value={reportDescription}
                                                            onChange={(e) => setReportDescription(e.target.value)}
                                                            required
                                                            maxLength={1000}
                                                            rows={3}
                                                            placeholder="Explain why you are reporting this post..."
                                                            className="w-full border border-rose-200 rounded-lg p-3 text-sm bg-white outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                                                        />

                                                        <p className="text-xs text-slate-500 text-right mt-1">
                                                            {reportDescription.length}/1000
                                                        </p>
                                                    </div>

                                                    {reportError && (
                                                        <p className="text-sm text-rose-700 bg-white rounded-lg p-2">
                                                            {reportError}
                                                        </p>
                                                    )}

                                                    <button
                                                        type="submit"
                                                        disabled={submittingReport}
                                                        className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white font-bold py-2.5 rounded-lg hover:bg-rose-700 disabled:opacity-60"
                                                    >
                                                        {submittingReport ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <Flag size={16} />
                                                        )}

                                                        {submittingReport ? "Submitting..." : "Submit Report"}
                                                    </button>
                                                </form>
                                            )}

                                            {reportMessage && (
                                                <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                                                    {reportMessage}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                </div>
                            )}

                            {/* Logged-out visitors */}
                            {!currentUser && !item.isResolved && (
                                <div className="pt-3 border-t border-emerald-100">
                                    <Link
                                        to="/login"
                                        className="flex items-center justify-center gap-2 w-full border-2 border-emerald-600 text-emerald-700 text-sm font-bold py-2.5 rounded-xl hover:bg-emerald-50 transition-colors"
                                    >
                                        <LogIn size={18} />
                                        Log in to contact the poster
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}