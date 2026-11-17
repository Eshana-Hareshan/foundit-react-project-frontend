import { useEffect, useState, type ElementType, type ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { ArrowLeft, Compass } from "lucide-react"

export interface AuthPerk {
  icon: ElementType
  text: string
}

interface AuthShellProps {
  /** Which side the green brand panel sits on (Login = left, Register = right). */
  side: "left" | "right"
  headline: string
  perks: AuthPerk[]
  children: ReactNode
}

/**
 * Shared layout for the Login and Register pages.
 *
 * They stay separate routes. When the user moves between them with a link that
 * carries `state={{ authSwitch: true }}`, the green panel slides to the other
 * side while the form slides in from where the panel used to be.
 */
export default function AuthShell({ side, headline, perks, children }: AuthShellProps) {
  const location = useLocation()
  const [switched] = useState<boolean>(
    !!(location.state as { authSwitch?: boolean } | null)?.authSwitch
  )

  // Clear the flag so a browser refresh doesn't replay the animation
  useEffect(() => {
    if (switched) {
      window.history.replaceState({ ...window.history.state, usr: null }, "")
    }
  }, [switched])

  const panelAnim = switched
    ? side === "left"
      ? "auth-panel-from-right"
      : "auth-panel-from-left"
    : ""

  const formAnim = switched
    ? side === "left"
      ? "auth-form-from-left"
      : "auth-form-from-right"
    : "auth-fade-in"

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center px-4 py-10">
      <style>{`
        @keyframes authPanelFromRight { from { transform: translateX(150%); } to { transform: none; } }
        @keyframes authPanelFromLeft  { from { transform: translateX(-150%); } to { transform: none; } }
        @keyframes authFormFromLeft   { from { transform: translateX(-66.67%); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes authFormFromRight  { from { transform: translateX(66.67%); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes authFadeIn         { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .auth-panel-from-right { animation: authPanelFromRight .7s cubic-bezier(.22,1,.36,1) both; }
        .auth-panel-from-left  { animation: authPanelFromLeft  .7s cubic-bezier(.22,1,.36,1) both; }
        .auth-form-from-left   { animation: authFormFromLeft   .7s cubic-bezier(.22,1,.36,1) both; }
        .auth-form-from-right  { animation: authFormFromRight  .7s cubic-bezier(.22,1,.36,1) both; }
        .auth-fade-in          { animation: authFadeIn .5s ease-out both; }
        @media (max-width: 1023px) {
          .auth-form-from-left  { animation-name: authFormFromLeftSm; }
          .auth-form-from-right { animation-name: authFormFromRightSm; }
        }
        @keyframes authFormFromLeftSm  { from { transform: translateX(-32px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes authFormFromRightSm { from { transform: translateX(32px); opacity: 0; } to { transform: none; opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .auth-panel-from-right, .auth-panel-from-left, .auth-form-from-left,
          .auth-form-from-right, .auth-fade-in { animation: none !important; }
        }
      `}</style>

      {/* Ambient background */}
      <div
        aria-hidden
        className="absolute -top-24 right-1/4 w-96 h-96 bg-emerald-200/50 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 left-1/4 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 mb-4 text-xs font-semibold text-emerald-800/70 hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <div className="relative grid lg:grid-cols-5 bg-white border border-emerald-100 rounded-3xl shadow-2xl shadow-emerald-900/10 overflow-hidden">
          {/* ============ BRAND PANEL ============ */}
          <div
            className={`hidden lg:flex lg:col-span-2 relative z-10 flex-col justify-between p-10 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white overflow-hidden ${
              side === "right" ? "lg:order-2" : ""
            } ${panelAnim}`}
          >
            <Compass
              aria-hidden
              className="absolute -right-16 -bottom-16 w-80 h-80 text-white/5 rotate-12"
              strokeWidth={1}
            />
            <div
              aria-hidden
              className="absolute -left-16 -top-16 w-56 h-56 rounded-full bg-emerald-400/20 blur-3xl"
            />

            <div className="relative flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/15 ring-1 ring-white/25 flex items-center justify-center">
                <Compass size={22} className="stroke-[2.25]" />
              </div>
              <span className="text-2xl font-black tracking-tight leading-none">
                found<span className="text-emerald-300">it</span>
              </span>
            </div>

            <div className="relative space-y-6">
              <h2 className="text-3xl font-black tracking-tight leading-tight">{headline}</h2>
              <ul className="space-y-4">
                {perks.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-emerald-50/90">
                    <span className="w-8 h-8 shrink-0 rounded-lg bg-white/10 ring-1 ring-white/20 flex items-center justify-center">
                      <Icon size={16} />
                    </span>
                    <span className="pt-1 leading-snug">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="relative text-xs text-emerald-100/60">Lost &amp; Found Portal</p>
          </div>

          {/* ============ FORM AREA ============ */}
          <div className={`lg:col-span-3 p-6 sm:p-10 space-y-6 ${formAnim}`}>
            {/* Mobile brand */}
            <div className="lg:hidden flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-200">
                <Compass size={22} className="stroke-[2.25]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-emerald-950 leading-none">
                found<span className="text-emerald-600">it</span>
              </span>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  )
}