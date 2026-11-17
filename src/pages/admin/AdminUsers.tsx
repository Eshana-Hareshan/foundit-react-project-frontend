
import { useEffect, useState } from "react";
import {
    Search,
    UserRound,
    ShieldCheck,
    Ban,
    CheckCircle
} from "lucide-react";

import {
    getAllUsers,
    updateUserSuspension
} from "../../service/admin";

interface User {
    _id: string;
    name: string;
    email: string;
    roles: string[];
    isEmailVerified: boolean;
    isSuspended: boolean;
    createdAt: string;
}

const AdminUsers = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingUserId, setUpdatingUserId] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getAllUsers(search);
                setUsers(response.data);
            } catch (error) {
                console.error("Failed to load users:", error);
                setError("Unable to load users. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [search]);

    const handleSuspension = async (user: User) => {
        const newStatus = !user.isSuspended;

        const action = newStatus ? "suspend" : "reactivate";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} ${user.name}'s account?`
        );

        if (!confirmed) return;

        try {
            setUpdatingUserId(user._id);

            const response = await updateUserSuspension(
                user._id,
                newStatus
            );

            // Update the user in the frontend state
            setUsers((previousUsers) =>
                previousUsers.map((currentUser) =>
                    currentUser._id === user._id
                        ? {
                            ...currentUser,
                            isSuspended: response.data.isSuspended
                        }
                        : currentUser
                )
            );

            window.alert(response.message);

        } catch (error: any) {
            console.error("Account status update failed:", error);

            window.alert(
                error.response?.data?.message ||
                "Failed to update account status."
            );
        } finally {
            setUpdatingUserId("");
        }
    };

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    User Management
                </h1>
                <p className="text-gray-500 mt-1">
                    View and manage registered Foundit accounts.
                </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="relative">
                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                {loading ? (
                    <p className="text-center py-12 text-gray-500">
                        Loading users...
                    </p>
                ) : error ? (
                    <p className="text-center py-12 text-red-600">
                        {error}
                    </p>
                ) : users.length === 0 ? (
                    <p className="text-center py-12 text-gray-500">
                        No users found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        Email Verification
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        Account Status
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        Registered
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => {
                                    const isAdmin = user.roles.includes("ADMIN");

                                    return (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <UserRound
                                                            className="text-blue-600"
                                                            size={20}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {isAdmin && (
                                                        <ShieldCheck
                                                            size={16}
                                                            className="text-blue-600"
                                                        />
                                                    )}
                                                    <span className="text-sm font-medium">
                                                        {user.roles.join(", ")}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    user.isEmailVerified
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                    {user.isEmailVerified
                                                        ? "Verified"
                                                        : "Not Verified"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    user.isSuspended
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}>
                                                    {user.isSuspended
                                                        ? "Suspended"
                                                        : "Active"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>

                                            <td className="px-6 py-4">
                                                {isAdmin ? (
                                                    <span className="text-xs text-gray-400">
                                                        Protected account
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleSuspension(user)}
                                                        disabled={updatingUserId === user._id}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
                                                            user.isSuspended
                                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                                : "bg-red-100 text-red-700 hover:bg-red-200"
                                                        }`}
                                                    >
                                                        {user.isSuspended ? (
                                                            <CheckCircle size={16} />
                                                        ) : (
                                                            <Ban size={16} />
                                                        )}

                                                        {updatingUserId === user._id
                                                            ? "Updating..."
                                                            : user.isSuspended
                                                                ? "Reactivate"
                                                                : "Suspend"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
};

export default AdminUsers;
