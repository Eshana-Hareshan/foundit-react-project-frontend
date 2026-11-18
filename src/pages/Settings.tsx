import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { updateProfile, changePassword } from "../service/auth";
import {
    User as UserIcon,
    Shield,
    Lock,
    Mail,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Loader2,
    KeyRound,
    ArrowLeft,
    Check,
    Info
} from "lucide-react";

export default function Settings() {
    const { user, setUser, loading: authLoading } = useAuth();

    // ==========================================
    // Profile Information State
    // ==========================================
    const [name, setName] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState("");
    const [profileError, setProfileError] = useState("");

    // Initialize username from auth context
    useEffect(() => {
        if (user?.name) {
            setName(user.name);
        }
    }, [user?.name]);

    // ==========================================
    // Password & Security State
    // ==========================================
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // ==========================================
    // Handlers
    // ==========================================

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError("");
        setProfileSuccess("");

        const trimmed = name.trim();

        if (!trimmed) {
            setProfileError("Username cannot be empty.");
            return;
        }

        if (trimmed.length < 2) {
            setProfileError("Username must be at least 2 characters.");
            return;
        }

        if (trimmed.length > 50) {
            setProfileError("Username cannot exceed 50 characters.");
            return;
        }

        if (trimmed === user?.name) {
            setProfileSuccess("Profile is already up to date.");
            return;
        }

        try {
            setProfileLoading(true);

            const response = await updateProfile(trimmed);

            // Update AuthContext so Header and other components update immediately
            if (user) {
                const updatedData = response.data || {};
                setUser({
                    ...user,
                    name: updatedData.name || trimmed
                });
            }

            setProfileSuccess(response.message || "Profile updated successfully!");
        } catch (err: any) {
            console.error("Profile update error:", err);
            setProfileError(
                err.response?.data?.message ||
                "Failed to update profile. Please try again."
            );
        } finally {
            setProfileLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (!currentPassword) {
            setPasswordError("Please enter your current password.");
            return;
        }

        if (!newPassword) {
            setPasswordError("Please enter a new password.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("New password must contain at least 6 characters.");
            return;
        }

        if (newPassword === currentPassword) {
            setPasswordError("New password cannot be the same as your current password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New password and confirmation do not match.");
            return;
        }

        try {
            setPasswordLoading(true);

            const response = await changePassword(currentPassword, newPassword);

            setPasswordSuccess(
                response.message || "Password changed successfully! Your active session is preserved."
            );

            // Clear password fields on successful update
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        } catch (err: any) {
            console.error("Change password error:", err);
            setPasswordError(
                err.response?.data?.message ||
                "Failed to update password. Please check your current password and try again."
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center gap-2 py-24 text-emerald-700 text-sm">
                <Loader2 size={18} className="animate-spin" /> Loading settings...
            </div>
        );
    }

    const userInitial = (user?.name?.trim()?.[0] || "U").toUpperCase();

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-16">
            {/* Header & Back link */}
            <div>
                <Link
                    to="/my-profile"
                    className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                    <ArrowLeft size={14} /> Back to Profile
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Settings &amp; Security
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Manage your account information, profile identity, and password security.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
                {/* ========================================================= */}
                {/* 1. PROFILE INFORMATION CARD                               */}
                {/* ========================================================= */}
                <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-7 shadow-sm shadow-emerald-900/5 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-emerald-100">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <UserIcon size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Profile Information
                            </h2>
                            <p className="text-xs text-slate-500">
                                Update your public display name on Foundit.
                            </p>
                        </div>
                    </div>

                    {/* Avatar & Email Identity preview */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/80">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-2xl font-black flex items-center justify-center ring-4 ring-white shadow-md shadow-emerald-200 shrink-0">
                            {userInitial}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-extrabold text-slate-900 truncate">
                                {user?.name || "User"}
                            </p>
                            <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                                <Mail size={13} className="shrink-0 text-emerald-600" />
                                <span className="truncate">{user?.email}</span>
                            </p>
                        </div>
                    </div>

                    {/* Alerts */}
                    {profileSuccess && (
                        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 animate-in fade-in duration-200">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                            <p className="font-semibold">{profileSuccess}</p>
                        </div>
                    )}

                    {profileError && (
                        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 animate-in fade-in duration-200">
                            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                            <p className="font-semibold">{profileError}</p>
                        </div>
                    )}

                    {/* Profile Form */}
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        {/* Username field */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Username / Full Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setProfileError("");
                                        setProfileSuccess("");
                                    }}
                                    maxLength={50}
                                    placeholder="Enter your name"
                                    disabled={profileLoading}
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 bg-white outline-none transition disabled:bg-slate-50 disabled:opacity-60"
                                />
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 flex justify-between">
                                <span>Shown publicly on items and chats</span>
                                <span>{name.length}/50</span>
                            </p>
                        </div>

                        {/* Email Address field (Read-only) */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Email Address
                                </label>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                    <Lock size={10} /> Read-only
                                </span>
                            </div>
                            <input
                                type="email"
                                value={user?.email || ""}
                                readOnly
                                disabled
                                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed select-none outline-none"
                            />
                            <p className="text-[11px] text-slate-400 mt-1">
                                Your email address is linked to your authentication account and cannot be modified.
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={profileLoading || name.trim() === user?.name}
                                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {profileLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Saving Profile...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        <span>Update Profile</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ========================================================= */}
                {/* 2. PASSWORD & SECURITY CARD                               */}
                {/* ========================================================= */}
                <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-7 shadow-sm shadow-emerald-900/5 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-emerald-100">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Password &amp; Security
                            </h2>
                            <p className="text-xs text-slate-500">
                                Ensure your account uses a secure password.
                            </p>
                        </div>
                    </div>

                    {/* Alerts */}
                    {passwordSuccess && (
                        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 animate-in fade-in duration-200">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                            <p className="font-semibold">{passwordSuccess}</p>
                        </div>
                    )}

                    {passwordError && (
                        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 animate-in fade-in duration-200">
                            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                            <p className="font-semibold">{passwordError}</p>
                        </div>
                    )}

                    {/* Change Password Form */}
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        {/* Current Password */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => {
                                        setCurrentPassword(e.target.value);
                                        setPasswordError("");
                                        setPasswordSuccess("");
                                    }}
                                    placeholder="Enter your current password"
                                    disabled={passwordLoading}
                                    required
                                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-sm border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 bg-white outline-none transition disabled:bg-slate-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                                >
                                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        setPasswordError("");
                                        setPasswordSuccess("");
                                    }}
                                    placeholder="At least 6 characters"
                                    disabled={passwordLoading}
                                    required
                                    minLength={6}
                                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-sm border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 bg-white outline-none transition disabled:bg-slate-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                                >
                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">
                                Minimum 6 characters required.
                            </p>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setPasswordError("");
                                        setPasswordSuccess("");
                                    }}
                                    placeholder="Re-enter your new password"
                                    disabled={passwordLoading}
                                    required
                                    minLength={6}
                                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-sm border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 bg-white outline-none transition disabled:bg-slate-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Security notice */}
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600">
                            <Info size={14} className="text-slate-500 shrink-0 mt-0.5" />
                            <span>
                                For your convenience, your current login session will remain active after changing your password.
                            </span>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {passwordLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Updating Password...</span>
                                    </>
                                ) : (
                                    <>
                                        <KeyRound size={16} />
                                        <span>Change Password</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
