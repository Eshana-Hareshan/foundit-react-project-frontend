
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    MailCheck,
    Sparkles,
    User,
    UserPlus,
    Zap,
} from "lucide-react";

import { register, verifyOTP } from "../service/auth";
import AuthShell from "../components/common/AuthShell";

const inputBase =
    "w-full py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

const labelBase = "block text-sm font-semibold text-slate-700 mb-1.5";

const PERKS = [
    {
        icon: Sparkles,
        text: "Free to join. Post lost or found items in minutes"
    },
    {
        icon: MailCheck,
        text: "Verified accounts keep the community trustworthy"
    },
    {
        icon: Zap,
        text: "Get notified when someone responds to your listing"
    },
];

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [conPassword, setConPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [otp, setOtp] = useState("");
    const [isOTPSent, setIsOTPSent] = useState(false);

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

    // Registration
    const handleRegister = async () => {

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanName || !cleanEmail || !password || !conPassword) {
            alert("Please fill all fields.");
            return;
        }

        if (password.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        if (password !== conPassword) {
            alert("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            const response = await register(
                cleanName,
                cleanEmail,
                password
            );

            setEmail(cleanEmail);

            // Check whether backend requires OTP verification
            const responseData = response.data;

            if (
                responseData?.requiresVerification === false ||
                responseData?.isEmailVerified === true
            ) {

                alert("Registration successful! You can now log in.");

                navigate("/login", {
                    state: { authSwitch: true },
                    replace: true
                });

                return;
            }

            setIsOTPSent(true);

            alert(
                "OTP sent to your email. Please check your inbox."
            );

        } catch (error: any) {

            console.error("Registration error:", error);

            console.error(
                "Backend response:",
                error.response?.data
            );

            console.error(
                "HTTP status:",
                error.response?.status
            );

            alert(getErrorMessage(error));

                } finally {

                    setLoading(false);

                }
            };

    // OTP verification
    const handleVerifyOTP = async () => {

        if (!/^\d{6}$/.test(otp)) {
            alert("Please enter a valid 6-digit OTP.");
            return;
        }

        setLoading(true);

        try {

            await verifyOTP(email, otp);

            alert(
                "Email verified successfully! You can now log in."
            );

            navigate("/login", {
                state: { authSwitch: true },
                replace: true
            });

        } catch (error) {

            console.error("OTP verification error:", error);

            alert(getErrorMessage(error));

        } finally {

            setLoading(false);

        }
    };

    // Form submission
    const handleSubmit = (e: FormEvent) => {

        e.preventDefault();

        if (loading) return;

        if (isOTPSent) {
            handleVerifyOTP();
        } else {
            handleRegister();
        }
    };

    const mismatch =
        Boolean(conPassword) && conPassword !== password;

    return (

        <AuthShell
            side="right"
            headline="Join the community that brings things back."
            perks={PERKS}
        >

            <div>

                <h1 className="text-3xl font-black tracking-tight text-emerald-950">
                    {isOTPSent
                        ? "Verify your email"
                        : "Create an account"}
                </h1>

                <p className="text-sm text-slate-500 mt-1.5">

                    {isOTPSent
                        ? "Enter the 6-digit code we sent to confirm your email address."
                        : "Join the foundit portal to report items, contact finders, and track listings."}

                </p>

            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                {!isOTPSent ? (

                    <>

                        {/* Full name */}
                        <div>

                            <label className={labelBase}>
                                Full name
                            </label>

                            <div className="relative">

                                <User
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className={`${inputBase} pl-11 pr-4`}
                                />

                            </div>

                        </div>

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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className={`${inputBase} pl-11 pr-4`}
                                />

                            </div>

                        </div>

                        {/* Password fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div>

                                <label className={labelBase}>
                                    Password
                                </label>

                                <div className="relative">

                                    <Lock
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
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

                            <div>

                                <label className={labelBase}>
                                    Confirm password
                                </label>

                                <div className="relative">

                                    <Lock
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        value={conPassword}
                                        onChange={(e) => setConPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={`${inputBase} pl-11 pr-4 ${
                                            mismatch
                                                ? "!border-rose-400 focus:!ring-rose-100"
                                                : ""
                                        }`}
                                    />

                                </div>

                            </div>

                        </div>

                        {mismatch && (

                            <p className="text-xs text-rose-600 -mt-2">
                                Passwords do not match.
                            </p>

                        )}

                        {/* Register button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                        >

                            {loading
                                ? <Loader2 size={18} className="animate-spin" />
                                : <UserPlus size={18} />
                            }

                            Create Account

                        </button>

                    </>

                ) : (

                    <>

                        {/* OTP email */}
                        <p className="text-xs text-center text-slate-500">

                            Code sent to{" "}

                            <span className="font-semibold text-emerald-800">
                                {email}
                            </span>

                        </p>

                        {/* OTP input */}
                        <div>

                            <label className={labelBase}>
                                Email verification code
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6)
                                    )
                                }
                                placeholder="------"
                                className={`${inputBase} px-4 text-center text-xl font-bold tracking-[0.5em] placeholder:tracking-[0.5em]`}
                            />

                        </div>

                        {/* Verify button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                        >

                            {loading && (
                                <Loader2 size={18} className="animate-spin" />
                            )}

                            Verify OTP

                        </button>

                        {/* Back button */}
                        <button
                            type="button"
                            onClick={() => setIsOTPSent(false)}
                            disabled={loading}
                            className="w-full py-2.5 rounded-xl border border-emerald-200 text-emerald-800 text-sm font-semibold hover:bg-emerald-50 transition-colors disabled:opacity-60"
                        >
                            Wrong email? Go back
                        </button>

                    </>

                )}

            </form>

            {/* Login link */}
            <p className="pt-4 border-t border-emerald-100 text-center text-sm text-slate-600">

                Already have an account?{" "}

                <Link
                    to="/login"
                    state={{ authSwitch: true }}
                    className="text-emerald-700 font-bold hover:text-emerald-900 hover:underline transition"
                >
                    Sign in
                </Link>

            </p>

        </AuthShell>

    );
}

export default Register;
