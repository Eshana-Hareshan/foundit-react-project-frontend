
import { useState, useContext, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import {
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    MessageCircle,
    PackageSearch,
    ShieldCheck,
} from "lucide-react";

import {
    googleLogin,
    login,
    getMyDetails
} from "../service/auth";

import AuthShell from "../components/common/AuthShell";
import { AuthContext } from "../context/AuthContext";

const inputBase =
    "w-full py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

const labelBase = "block text-sm font-semibold text-slate-700 mb-1.5";

const PERKS = [
    {
        icon: PackageSearch,
        text: "Report lost items and browse what others have found"
    },
    {
        icon: MessageCircle,
        text: "Chat directly with finders and owners"
    },
    {
        icon: ShieldCheck,
        text: "Arrange safe handovers in your community"
    },
];

function Login() {

    const navigate = useNavigate();

    const auth = useContext(AuthContext);

    if (!auth) {
        throw new Error(
            "Login must be used inside AuthProvider."
        );
    }

    const { setUser } = auth;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Complete login and update authentication context
    const completeLogin = async (res: any) => {

        const {
            access_token,
            refresh_token
        } = res.data;

        if (!access_token || !refresh_token) {
            throw new Error("Authentication tokens are missing.");
        }

        // Save tokens
        localStorage.setItem("ACCESS_TOKEN", access_token);
        localStorage.setItem("REFRESH_TOKEN", refresh_token);

        try {

            // Retrieve authenticated user details
            const response = await getMyDetails();

            const userData =
                response.data?.data ?? response.data;

            if (!userData || !userData.email) {
                throw new Error("User information not received.");
            }

            // Update AuthContext
            setUser(userData);

            // Navigate according to current database roles
            if (userData.roles?.includes("ADMIN")) {
                navigate("/admin", { replace: true });
            } else {
                navigate("/", { replace: true });
            }

        } catch (error) {

            // Clear tokens if authentication details cannot be retrieved
            localStorage.removeItem("ACCESS_TOKEN");
            localStorage.removeItem("REFRESH_TOKEN");

            setUser(null);

            throw error;
        }
    };

    // Normal login
    const handleLogin = async () => {

        if (!email.trim() || !password) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);

        try {

            const res = await login(email.trim(), password);

            await completeLogin(res);

        } catch (err) {

            console.error("Login error:", err);

            alert("Login failed. Please check your credentials.");

        } finally {

            setLoading(false);

        }
    };

    // Google login
    const handleGoogleSuccess = async (credential: string) => {

        setLoading(true);

        try {

            const res = await googleLogin(credential);

            await completeLogin(res);

        } catch (err) {

            console.error("Google login error:", err);

            alert("Google login failed. Please try again.");

        } finally {

            setLoading(false);

        }
    };

    // Form submission
    const handleSubmit = (e: FormEvent) => {

        e.preventDefault();

        if (loading) return;

        handleLogin();
    };

    return (
        <AuthShell
            side="left"
            headline="Helping lost things find their way home."
            perks={PERKS}
        >

            <div>
                <h1 className="text-3xl font-black tracking-tight text-emerald-950">
                    Welcome back
                </h1>

                <p className="text-sm text-slate-500 mt-1.5">
                    Sign in to report lost items, view updates, and connect with finders.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

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

                <div>

                    <div className="flex items-center justify-between mb-1.5">

                        <label className="text-sm font-semibold text-slate-700">
                            Password
                        </label>

                        <Link
                            to="/forgot-password"
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                        >
                            Forgot password?
                        </Link>

                    </div>

                    <div className="relative">

                        <Lock
                            size={18}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`${inputBase} pl-11 pr-11`}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-700"
                        >
                            {showPassword
                                ? <EyeOff size={18} />
                                : <Eye size={18} />
                            }
                        </button>

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

                    Sign In
                </button>

            </form>

            {/* OR divider */}
            <div className="flex items-center gap-3">

                <div className="flex-1 border-t border-emerald-100" />

                <span className="text-xs font-medium text-slate-400">
                    OR
                </span>

                <div className="flex-1 border-t border-emerald-100" />

            </div>

            {/* Google login */}
            <div className="flex justify-center">

                <GoogleLogin
                    onSuccess={(response) => {

                        if (response.credential) {
                            handleGoogleSuccess(response.credential);
                        }

                    }}
                    onError={() => {
                        alert("Google authentication failed");
                    }}
                    theme="outline"
                    size="large"
                    text="continue_with"
                    shape="pill"
                    width="300"
                />

            </div>

            {/* Switch to register */}
            <p className="pt-4 border-t border-emerald-100 text-center text-sm text-slate-600">

                Don't have an account?{" "}

                <Link
                    to="/register"
                    state={{ authSwitch: true }}
                    className="text-emerald-700 font-bold hover:text-emerald-900 hover:underline transition"
                >
                    Create account
                </Link>

            </p>

        </AuthShell>
    );
}

export default Login;
