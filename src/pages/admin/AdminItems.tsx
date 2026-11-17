
import { useEffect, useState } from "react";
import { Search, Package } from "lucide-react";
import {
    getAllAdminItems,
    moderateItem
} from "../../service/admin";

interface Item {
    _id: string;
    itemName: string;
    category: string;
    location: string;
    status: "LOST" | "FOUND";
    isResolved: boolean;
    moderationStatus?: string;
    moderationReason?: string;
    userId: {
        name: string;
        email: string;
    } | null;
}

type ModerationAction =
    | "REQUEST_EDIT"
    | "RESTRICT"
    | "REMOVE"
    | "RESTORE";

const AdminItems = () => {

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");

    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedActions, setSelectedActions] = useState<
        Record<string, ModerationAction>
    >({});

    const [reasons, setReasons] = useState<Record<string, string>>({});
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchItems = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAllAdminItems(search, filter);
            setItems(response.data || []);

        } catch (error) {
            console.error("Failed to fetch Admin items:", error);
            setError("Failed to load items. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [search, filter]);

    const handleModeration = async (itemId: string) => {

        const action = selectedActions[itemId] || "REQUEST_EDIT";
        const reason = reasons[itemId]?.trim();

        if (!reason) {
            alert("Please enter a reason for this action.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to perform ${action.replaceAll("_", " ")}?`
        );

        if (!confirmed) return;

        try {
            setProcessingId(itemId);

            await moderateItem(itemId, action, reason);

            alert("Moderation action completed successfully.");

            setReasons((previous) => ({
                ...previous,
                [itemId]: ""
            }));

            await fetchItems();

        } catch (error) {
            console.error("Moderation failed:", error);
            alert("Failed to perform moderation action.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Item Management
                </h1>

                <p className="text-gray-500 mt-2">
                    Review and manage Lost and Found listings.
                </p>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4">

                <div className="relative flex-1">
                    <Search
                        size={20}
                        className="absolute left-3 top-3 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search item or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="ALL">All Moderation Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="EDIT_REQUESTED">Edit Requested</option>
                    <option value="RESTRICTED">Restricted</option>
                    <option value="REMOVED">Removed</option>
                </select>

            </div>

            {/* Items Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                <div className="p-5 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-800">
                        Items ({items.length})
                    </h2>
                </div>

                {loading ? (
                    <p className="p-8 text-center text-gray-500">
                        Loading items...
                    </p>
                ) : error ? (
                    <p className="p-8 text-center text-red-600">
                        {error}
                    </p>
                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="bg-gray-50 text-gray-500 text-sm">
                                <tr>
                                    <th className="p-4">Item</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Owner</th>
                                    <th className="p-4">Moderation</th>
                                    <th className="p-4">Resolution</th>
                                    <th className="p-4">Admin Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {items.map((item) => {

                                    const status = item.moderationStatus || "ACTIVE";

                                    return (
                                        <tr key={item._id}>

                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                        <Package
                                                            className="text-blue-600"
                                                            size={20}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {item.itemName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {item.location}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4 text-gray-600">
                                                {item.category}
                                            </td>

                                            <td className="p-4">
                                                {item.status}
                                            </td>

                                            <td className="p-4 text-gray-600">
                                                <p>{item.userId?.name || "Unknown"}</p>
                                                <p className="text-xs text-gray-400">
                                                    {item.userId?.email || ""}
                                                </p>
                                            </td>

                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                    {status.replaceAll("_", " ")}
                                                </span>
                                                {item.moderationReason && (
                                                    <p className="text-xs text-gray-500 mt-2 max-w-40">
                                                        {item.moderationReason}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    item.isResolved
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-orange-100 text-orange-700"
                                                }`}>
                                                    {item.isResolved ? "Resolved" : "Open"}
                                                </span>
                                            </td>

                                            <td className="p-4 min-w-64">

                                                <div className="space-y-2">

                                                    <select
                                                        value={selectedActions[item._id] || "REQUEST_EDIT"}
                                                        onChange={(e) =>
                                                            setSelectedActions((previous) => ({
                                                                ...previous,
                                                                [item._id]: e.target.value as ModerationAction
                                                            }))
                                                        }
                                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                    >
                                                        <option value="REQUEST_EDIT">Request Edit</option>
                                                        <option value="RESTRICT">Restrict</option>
                                                        <option value="REMOVE">Remove</option>
                                                        <option value="RESTORE">Restore</option>
                                                    </select>

                                                    <textarea
                                                        value={reasons[item._id] || ""}
                                                        onChange={(e) =>
                                                            setReasons((previous) => ({
                                                                ...previous,
                                                                [item._id]: e.target.value
                                                            }))
                                                        }
                                                        placeholder="Enter reason..."
                                                        rows={2}
                                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                    />

                                                    <button
                                                        onClick={() => handleModeration(item._id)}
                                                        disabled={processingId === item._id}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg py-2 text-sm font-medium"
                                                    >
                                                        {processingId === item._id
                                                            ? "Processing..."
                                                            : "Apply Action"}
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                })}

                                {items.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            No items found.
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                )}

            </div>

        </div>
    );
};

export default AdminItems;
