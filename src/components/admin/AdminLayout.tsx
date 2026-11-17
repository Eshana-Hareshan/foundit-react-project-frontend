
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {

    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case "/admin":
                return "Dashboard";

            case "/admin/users":
                return "User Management";

            case "/admin/items":
                return "Item Management";

            case "/admin/reports":
                return "Reports";

            case "/admin/settings":
                return "Settings";

            default:
                return "Admin Panel";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">

            <AdminSidebar />

            <div className="flex-1 min-w-0">

                <AdminHeader title={getPageTitle()} />

                <main className="p-8">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default AdminLayout;
