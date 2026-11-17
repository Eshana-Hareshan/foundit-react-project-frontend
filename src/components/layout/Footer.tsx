import React from 'react';
import { Compass } from 'lucide-react';

const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: 'More from foundit',
    links: ['Banner Ads', 'Featured Priority Posts', 'Partner Rewards Program'],
  },
  {
    title: 'Help & Support',
    links: ['Contact Us', 'FAQ & Claim Guidelines', 'Safety Tips for Handover'],
  },
  {
    title: 'About Us',
    links: ['About Us', 'Privacy Policy', 'Terms of Service'],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-100/80 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-emerald-900">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center">
                <Compass size={22} className="stroke-[2.25]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white leading-none">
                found<span className="text-emerald-400">it</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-emerald-100/60">
              Helping lost things find their way back home.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="font-bold text-xs text-emerald-300 uppercase tracking-widest">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="text-emerald-100/70 hover:text-white hover:translate-x-0.5 inline-block transition-all"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-medium text-emerald-100/50">
          <span>© 2026. All Rights Reserved. EHB</span>
          <span className="inline-flex items-center gap-1.5">
            <Compass size={12} /> Always find your way
          </span>
        </div>
      </div>
    </footer>
  );
};
