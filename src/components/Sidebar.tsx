"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const navItems = [
  {
    href: "/app",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/app/payment-links",
    label: "Payment Links",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    href: "/app/invoices",
    label: "Invoices",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: "/app/splits",
    label: "Split Payments",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><circle cx="7" cy="17" r="3" /><circle cx="17" cy="17" r="3" /><line x1="7" y1="10" x2="7" y2="14" /><line x1="17" y1="10" x2="17" y2="14" /><line x1="10" y1="7" x2="14" y2="7" />
      </svg>
    ),
  },
  {
    href: "/app/escrow",
    label: "Escrow",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

const pageTitles: Record<string, string> = {
  "/app": "Dashboard",
  "/app/payment-links": "Payment Links",
  "/app/invoices": "Invoices",
  "/app/splits": "Split Payments",
  "/app/escrow": "Escrow",
};

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentTitle = pageTitles[pathname] || "ArcPay";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0A0F1E] border-b-2 border-[#1a1a1a] flex items-center justify-between px-4" style={{ zIndex: 9999 }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></svg>
            )}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#00D084] rounded-md flex items-center justify-center border-2 border-[#1a1a1a]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <span className="font-black text-sm text-[#00D084] hidden sm:inline">ARC<span className="text-white">Pay</span></span>
          </Link>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <span className="text-gray-400 font-bold text-sm hidden sm:inline">{currentTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors hidden sm:flex items-center gap-1 mr-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            Landing
          </Link>
          <ConnectButton accountStatus="avatar" chainStatus="icon" showBalance />
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden" style={{ zIndex: 9998 }} onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed top-14 left-0 bottom-0 w-64 bg-[#0A0F1E] border-r-2 border-[#1a1a1a] flex flex-col transition-transform duration-300 md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ zIndex: 9997 }}
      >
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? "bg-[#00D084] text-[#1a1a1a]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            Back to Landing
          </Link>
        </div>
      </aside>
    </>
  );
}
