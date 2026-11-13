import { useState } from "react"
import { Link } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { Clock, ArrowLeft } from "lucide-react"
import { googleLogin, login } from "../service/auth"
import { Button } from "../components/common/Button"
import { InputField } from "../components/forms/InputField"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return alert("Please fill all fields")

    setLoading(true)
    try {
      const res = await login(email, password)
      const { access_token, refresh_token } = res.data

      if (!access_token || !refresh_token) throw new Error("Tokens missing")

      localStorage.setItem("ACCESS_TOKEN", access_token)
      localStorage.setItem("REFRESH_TOKEN", refresh_token)

      window.location.href = "/"
    } catch (err) {
      console.error(err)
      alert("Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credential: string) => {
  setLoading(true)

  try {
    const res = await googleLogin(credential)

    const { access_token, refresh_token } = res.data

    if (!access_token || !refresh_token) {
      throw new Error("Tokens missing")
    }

    localStorage.setItem("ACCESS_TOKEN", access_token)
    localStorage.setItem("REFRESH_TOKEN", refresh_token)

    window.location.href = "/"

  } catch (err) {
    console.error("Google login error:", err)
    alert("Google login failed. Please try again.")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-4 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 p-8 sm:p-10 space-y-6">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Clock size={22} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                found<span className="text-indigo-600">it</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Lost & Found Portal
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to report lost items, view updates, and connect with finders.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <InputField
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleLogin}
          isLoading={loading}
          variant="primary"
          className="w-full py-3"
        >
          Sign In
        </Button>

          {/* OR Divider */}
  <div className="flex items-center gap-3">
    <div className="flex-1 border-t border-slate-200" />
    <span className="text-xs text-slate-400">OR</span>
    <div className="flex-1 border-t border-slate-200" />
  </div>

  {/* Google Login */}
  <div className="flex justify-center">
    <GoogleLogin
      onSuccess={(response) => {
        if (response.credential) {
          handleGoogleSuccess(response.credential)
        }
      }}
      onError={() => {
        alert("Google authentication failed")
      }}
      theme="outline"
      size="large"
      text="continue_with"
      shape="rectangular"
      width="340"
    />
  </div>

        {/* Switch to Register */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition"
            >
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login
