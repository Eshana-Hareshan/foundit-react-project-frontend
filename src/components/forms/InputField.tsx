import React, { type InputHTMLAttributes } from "react"

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition ${
          error
            ? "border-rose-300 focus:border-rose-500"
            : "border-slate-300 focus:border-indigo-600 focus:bg-white"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-[11px] text-rose-500 font-medium">{error}</p>
      )}
    </div>
  )
}
