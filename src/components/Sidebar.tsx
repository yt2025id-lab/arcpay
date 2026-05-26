"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const navItems = [
  { href: "/app", label: "Dashboard", icon: "█" },
  { href: "/app/payment-links", label: "Payment Links", icon: "→" },
  { href: "/app/invoices", label: "Invoices", icon: "▤" },
  { href: "/app/splits", label: "Split Payments", icon: "⟐" },
  { href: "/app/escrow", label: "Escrow", icon: "🔒" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-arc-dark border-r-2 border-arc-black flex flex-col z-50">
      <div className="p-6 border-b-2 border-arc-black">
        <Link href="/" className="text-2xl font-black text-arc-green tracking-tight">
          Arc<span className="text-white">Pay</span>
        </Link>
        <p className="text-xs text-gray-400 mt-1">USDC Payments on Arc</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                isActive
                  ? "bg-arc-green text-arc-black neo-border-thick"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-2 border-arc-black">
        <ConnectButton
          accountStatus="avatar"
          chainStatus="icon"
          showBalance
        />
      </div>

      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Back to Landing
        </Link>
      </div>
    </aside>
  );
}
