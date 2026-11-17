
import { useEffect, useState } from "react";
import {
    Users,
    Package,
    Flag,
    UserCheck,
    Search,
    PackageCheck
} from "lucide-react";

import { getAdminDashboard } from "../../service/admin";

interface DashboardStats {
    totalUsers: number;
    totalAdmins: number;
    totalNormalUsers: number;
    unverifiedUsers: number;
    totalItems: number;
    lostItems: number;
    foundItems: number;
    resolvedItems: number;
    suspendedUsers: number;
    pendingReports: number;
}

const AdminDashboard = () => {

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchDashboard = async () => {
            try {
                const response = await getAdminDashboard();

                setStats(response.data);

            } catch (error) {
                console.error("Dashboard loading error:", error);
                setError("Unable to load dashboard statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();

    }, []);

    if (loading) {
        return (
            <div className="text-center py-20 text-gray-500">
                Loading dashboard...
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="bg-red-50 text-red-600 p-5 rounded-lg">
                {error || "Dashboard statistics are unavailable."}
            </div>
        );
    }

    const statistics = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Total Items",
            value: stats.totalItems,
            icon: Package,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Lost Items",
            value: stats.lostItems,
            icon: Search,
            color: "bg-orange-100 text-orange-600"
        },
        {
            title: "Found Items",
            value: stats.foundItems,
            icon: PackageCheck,
            color: "bg-purple-100 text-purple-600"
        },
        {
            title: "Admin Accounts",
            value: stats.totalAdmins,
            icon: UserCheck,
            color: "bg-indigo-100 text-indigo-600"
        },
        {
            title: "Unverified Users",
            value: stats.unverifiedUsers,
            icon: Flag,
            color: "bg-red-100 text-red-600"
        },
        {
            title: "Suspended Users",
            value: stats.suspendedUsers,
            icon: UserCheck,
            color: "bg-red-100 text-red-600"
        },
        {
            title: "Pending Reports",
            value: stats.pendingReports,
            icon: Flag,
            color: "bg-yellow-100 text-yellow-600"
        }
    ];

    return (
        <div className="space-y-8">

            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome to Foundit Admin
                </h1>

                <p className="text-gray-500 mt-2">
                    Here is an overview of your platform.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

                {statistics.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                        >
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {stat.title}
                                    </p>

                                    <h2 className="text-3xl font-bold text-gray-800 mt-3">
                                        {stat.value}
                                    </h2>
                                </div>

                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                                    <Icon size={24} />
                                </div>

                            </div>
                        </div>
                    );
                })}

            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                <h2 className="text-lg font-bold text-gray-800">
                    Item Summary
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">

                    <div>
                        <p className="text-sm text-gray-500">
                            Lost Items
                        </p>
                        <p className="text-2xl font-bold mt-2">
                            {stats.lostItems}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Found Items
                        </p>
                        <p className="text-2xl font-bold mt-2">
                            {stats.foundItems}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Resolved Items
                        </p>
                        <p className="text-2xl font-bold mt-2">
                            {stats.resolvedItems}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;
