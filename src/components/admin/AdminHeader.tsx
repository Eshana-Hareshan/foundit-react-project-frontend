
import { ShieldCheck, UserCircle } from "lucide-react";

interface AdminHeaderProps {
    title: string;
    adminName?: string;
}

const AdminHeader = ({
    title,
    adminName = "Administrator"
}: AdminHeaderProps) => {

    return (
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">

            {/* Page title */}
            <div>
                <h2 className="text-xl font-bold text-gray-800">
                    {title}
                </h2>

                <p className="text-sm text-gray-500">
                    Manage your Foundit platform
                </p>
            </div>

            {/* Admin profile */}
            <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserCircle className="text-blue-600" size={24} />
                </div>

                <div>
                    <p className="text-sm font-semibold text-gray-800">
                        {adminName}
                    </p>

                    <div className="flex items-center gap-1 text-xs text-blue-600">
                        <ShieldCheck size={13} />
                        <span>ADMIN</span>
                    </div>
                </div>

            </div>

        </header>
    );
};

export default AdminHeader;
