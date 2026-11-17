import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import {
    LayoutDashboard,
    Users,
    PackageSearch,
    Flag,
    Settings,
    LogOut,
    History
} from "lucide-react";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("REFRESH_TOKEN");

        setUser(null);

        navigate("/login", { replace: true });
    };

    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: LayoutDashboard
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: Users
        },
        {
            name: "Items",
            path: "/admin/items",
            icon: PackageSearch
        },
        {
            name: "Reports",
            path: "/admin/reports",
            icon: Flag
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: Settings
        },
        {
            name: "Moderation History",
            path: "/admin/moderation-history",
            icon: History
        }
    ];

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">

            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-blue-600">
                    Foundit
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Administration Panel
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">

                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === "/admin"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            <Icon size={20} />

                            <span className="font-medium">
                                {item.name}
                            </span>

                        </NavLink>
                    );
                })}

            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

        </aside>
    );
};

export default AdminSidebar;
