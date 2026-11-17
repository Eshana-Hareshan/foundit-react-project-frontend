
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Check,
    Compass,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    Lock,
    Mail,
    ShieldCheck,
} from "lucide-react";

import {
    forgotPassword,
    resetPassword
} from "../service/auth";

const inputBase =
    "w-full py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

const labelBase = "block text-sm font-semibold text-slate-700 mb-1.5";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [step, setStep] = useState<"EMAIL" | "RESET">("EMAIL");

    const [loading, setLoading] = useState(false);

    // Extract backend error message
    const getErrorMessage = (error: unknown): string => {

        const err = error as {
            response?: {
                data?: {
                    message?: string;
                };
            };
        };

        return (
            err.response?.data?.message ||
            "Something went wrong. Please try again."
        );
    };

    // Send password reset OTP
    const handleForgotPassword = async () => {

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail) {
            alert("Please enter your email address.");
            return;
        }

        setLoading(true);

        try {

            await forgotPassword(cleanEmail);

            setEmail(cleanEmail);

            setOtp("");

            alert(
                "Password reset OTP sent to your email. Please check your inbox."
            );

            setStep("RESET");

        } catch (error) {

            console.error("Forgot password error:", error);

            alert(getErrorMessage(error));

        } finally {

            setLoading(false);

        }
    };

    // Reset password
    const handleResetPassword = async () => {

        if (!email || !otp || !newPassword || !confirmPassword) {
            alert("Please fill all fields.");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            alert("Please enter a valid 6-digit OTP.");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            await resetPassword(
                email,
                otp,
                newPassword
            );

            alert(
                "Password reset successfully. Please log in with your new password."
            );

            navigate("/login", {
                replace: true
            });

        } catch (error) {

            console.error("Reset password error:", error);

            alert(getErrorMessage(error));

        } finally {

            setLoading(false);

        }
    };

    // Form submission
    const handleSubmit = (e: FormEvent) => {

        e.preventDefault();

        if (loading) return;

        if (step === "EMAIL") {
            handleForgotPassword();
        } else {
            handleResetPassword();
        }
    };

    const isReset = step === "RESET";

    const passwordMismatch =
        Boolean(confirmPassword) &&
        confirmPassword !== newPassword;

    return (

        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex justify-center items-center px-4 py-12">

            {/* Decorative background */}
            <Compass
                aria-hidden
                className="absolute -right-24 -top-24 w-[28rem] h-[28rem] text-emerald-200/40 rotate-12"
                strokeWidth={1}
            />

            <div
                aria-hidden
                className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-emerald-300/30 blur-3xl"
            />

            <div className="relative w-full max-w-md">

                {/* Brand */}
                <Link
                    to="/"
                    className="flex items-center justify-center gap-2.5 mb-6 hover:opacity-90 transition-opacity"
                >

                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-200">

                        <Compass size={22} className="stroke-[2.25]" />

                    </div>

                    <span className="text-2xl font-black tracking-tight text-emerald-950 leading-none">

                        found<span className="text-emerald-600">it</span>

                    </span>

                </Link>

                <div className="bg-white/90 backdrop-blur border border-emerald-100 rounded-3xl shadow-xl shadow-emerald-900/5 p-6 sm:p-8 space-y-6">

                    {/* Step indicator */}
                    <div
                        className="flex items-center justify-center gap-2"
                        aria-label={`Step ${isReset ? 2 : 1} of 2`}
                    >

                        <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">

                            {isReset ? <Check size={14} /> : 1}

                        </span>

                        <span
                            className={`h-1 w-12 rounded-full ${
                                isReset
                                    ? "bg-emerald-600"
                                    : "bg-emerald-100"
                            }`}
                        />

                        <span
                            className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                                isReset
                                    ? "bg-emerald-600 text-white"
                                    : "bg-emerald-100 text-emerald-700"
                            }`}
                        >
                            2
                        </span>

                    </div>

                    {/* Heading */}
                    <div className="text-center">

                        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">

                            {isReset
                                ? <ShieldCheck size={28} />
                                : <KeyRound size={28} />
                            }

                        </div>

                        <h1 className="text-2xl font-black tracking-tight text-emerald-950">

                            {isReset
                                ? "Reset your password"
                                : "Forgot password?"
                            }

                        </h1>

                        <p className="text-sm text-slate-500 mt-2">

                            {isReset
                                ? "Enter the OTP sent to your email and create a new password."
                                : "Enter your registered email address to receive a reset code."
                            }

                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {!isReset ? (

                            <>

                                {/* Email */}
                                <div>

                                    <label className={labelBase}>
                                        Email address
                                    </label>

                                    <div className="relative">

                                        <Mail
                                            size={18}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="email"
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`${inputBase} pl-11 pr-4`}
                                        />

                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                                >

                                    {loading && (
                                        <Loader2 size={18} className="animate-spin" />
                                    )}

                                    Send OTP

                                </button>

                            </>

                        ) : (

                            <>

                                {/* Email information */}
                                <p className="text-xs text-center text-slate-500 -mt-2">

                                    Code sent to{" "}

                                    <span className="font-semibold text-emerald-800">
                                        {email}
                                    </span>

                                </p>

                                {/* OTP */}
                                <div>

                                    <label className={labelBase}>
                                        Verification OTP
                                    </label>

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        placeholder="------"
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(
                                                e.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 6)
                                            )
                                        }
                                        className={`${inputBase} px-4 text-center text-xl font-bold tracking-[0.5em] placeholder:tracking-[0.5em]`}
                                    />

                                </div>

                                {/* New password */}
                                <div>

                                    <label className={labelBase}>
                                        New password
                                    </label>

                                    <div className="relative">

                                        <Lock
                                            size={18}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className={`${inputBase} pl-11 pr-11`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((s) => !s)}
                                            aria-label={
                                                showPassword
                                                    ? "Hide passwords"
                                                    : "Show passwords"
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-700"
                                        >

                                            {showPassword
                                                ? <EyeOff size={18} />
                                                : <Eye size={18} />
                                            }

                                        </button>

                                    </div>

                                </div>

                                {/* Confirm password */}
                                <div>

                                    <label className={labelBase}>
                                        Confirm new password
                                    </label>

                                    <div className="relative">

                                        <Lock
                                            size={18}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`${inputBase} pl-11 pr-4 ${
                                                passwordMismatch
                                                    ? "!border-rose-400 focus:!ring-rose-100"
                                                    : ""
                                            }`}
                                        />

                                    </div>

                                    {passwordMismatch && (

                                        <p className="text-xs text-rose-600 mt-1.5">
                                            Passwords do not match.
                                        </p>

                                    )}

                                </div>

                                {/* Reset password */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                                >

                                    {loading && (
                                        <Loader2 size={18} className="animate-spin" />
                                    )}

                                    Reset Password

                                </button>

                                {/* Resend OTP */}
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    disabled={loading}
                                    className="w-full py-2.5 rounded-xl border border-emerald-200 text-emerald-800 text-sm font-semibold hover:bg-emerald-50 transition-colors disabled:opacity-60"
                                >
                                    Resend OTP
                                </button>

                            </>

                        )}

                    </form>

                    {/* Back to login */}
                    <div className="text-center border-t border-emerald-100 pt-4">

                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                        >

                            <ArrowLeft size={15} />

                            Back to Login

                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ForgotPassword;
