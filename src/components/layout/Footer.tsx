
import React from "react"

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-200">

          {/* More from Found It */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              More from foundit
            </h4>

            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  Banner Ads
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  Featured Priority Posts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  Partner Rewards Program
                </a>
              </li>
            </ul>
          </div>

          {/* Help and Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Help &amp; Support
            </h4>

            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  FAQ &amp; Claim Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  Safety Tips for Handover
                </a>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              About Us
            </h4>

            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 text-center text-xs font-semibold text-slate-500">
          © 2026. All Rights Reserved. EHB
        </div>

      </div>
    </footer>
  )
}
