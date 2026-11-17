
import { useEffect, useState } from "react";
import { Save, Settings, Loader2 } from "lucide-react";
import {
    getSettings,
    updateSettings,
    type PlatformSettings
} from "../../service/settings";

const AdminSettings = () => {

    const [platformName, setPlatformName] = useState("Foundit");

    const [description, setDescription] = useState(
        "Lost and Found Management Platform"
    );

    const [registrationEnabled, setRegistrationEnabled] = useState(true);

    const [emailVerification, setEmailVerification] = useState(true);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // Load settings from MongoDB
    useEffect(() => {

        const fetchSettings = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getSettings();

                const settings: PlatformSettings = response.data;

                setPlatformName(settings.platformName);
                setDescription(settings.description);
                setRegistrationEnabled(settings.registrationEnabled);
                setEmailVerification(settings.emailVerification);

            } catch (error: any) {
                console.error("Settings loading error:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load platform settings."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();

    }, []);

    // Save settings to MongoDB
    const handleSave = async () => {

        if (!platformName.trim() || !description.trim()) {
            setError("Please complete all required fields.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const settings: PlatformSettings = {
                platformName,
                description,
                registrationEnabled,
                emailVerification
            };

            const response = await updateSettings(settings);

            setPlatformName(response.data.platformName);
            setDescription(response.data.description);
            setRegistrationEnabled(response.data.registrationEnabled);
            setEmailVerification(response.data.emailVerification);

            setSuccess("Settings saved successfully.");

        } catch (error: any) {
            console.error("Settings saving error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to save settings."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 text-gray-500">
                <Loader2 className="animate-spin mr-2" size={22} />
                Loading platform settings...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Platform Settings
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage your Foundit platform configuration.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">

                <div className="flex items-center gap-3 border-b border-gray-200 pb-5">

                    <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Settings className="text-blue-600" size={23} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-800">
                            General Settings
                        </h2>

                        <p className="text-sm text-gray-500">
                            Basic platform configuration
                        </p>
                    </div>

                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">
                        {success}
                    </div>
                )}

                {/* Platform name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Name
                    </label>

                    <input
                        type="text"
                        value={platformName}
                        maxLength={100}
                        onChange={(e) => setPlatformName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Description
                    </label>

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={500}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Registration */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-5">

                    <div>
                        <p className="font-medium text-gray-800">
                            User Registration
                        </p>

                        <p className="text-sm text-gray-500">
                            Allow new users to register.
                        </p>
                    </div>

                    <input
                        type="checkbox"
                        checked={registrationEnabled}
                        onChange={(e) => setRegistrationEnabled(e.target.checked)}
                        className="w-5 h-5 accent-blue-600"
                    />

                </div>

                {/* Email verification */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-5">

                    <div>
                        <p className="font-medium text-gray-800">
                            Email Verification
                        </p>

                        <p className="text-sm text-gray-500">
                            Require email verification for new accounts.
                        </p>
                    </div>

                    <input
                        type="checkbox"
                        checked={emailVerification}
                        onChange={(e) => setEmailVerification(e.target.checked)}
                        className="w-5 h-5 accent-blue-600"
                    />

                </div>

                {/* Save button */}
                <div className="border-t border-gray-200 pt-5">

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        {saving ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}

                        {saving ? "Saving..." : "Save Settings"}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default AdminSettings;
