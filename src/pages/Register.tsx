import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Clock, ArrowLeft } from "lucide-react"
import { register } from "../service/auth"
import { Button } from "../components/common/Button"
import { InputField } from "../components/forms/InputField"

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setCOnPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password || !conPassword)
      return alert("Please fill all fields")
    if (password !== conPassword) return alert("Passwords do not match")

    setLoading(true)
    try {
      await register(name, email, password)
      alert("Registration success! You can now log in.")
      navigate("/login")
    } catch (err) {
      console.error(err)
      alert("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

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

      {/* Register Card */}
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
            Create an Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join the foundit portal to report items, contact finders, and track listings.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <InputField
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />

          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <InputField
            label="Confirm Password"
            type="password"
            value={conPassword}
            onChange={(e) => setCOnPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleRegister}
          isLoading={loading}
          disabled={loading}
          variant="primary"
          className="w-full py-3"
        >
          Create Account
        </Button>

        {/* Switch to Login */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Register
