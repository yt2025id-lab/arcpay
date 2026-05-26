"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { useUsdcBalance } from "@/hooks/usePaymentLink";
import { formatAddress, formatUsdc } from "@/lib/utils";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { data: addresses, isLoading: addrsLoading } = useFactoryAddresses();
  const { data: usdcBalance } = useUsdcBalance(address!);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
        <div className="w-20 h-20 bg-arc-green neo-border-thick rounded-2xl flex items-center justify-center neo-shadow-lg">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2">ArcPay</h1>
          <p className="text-gray-500 text-lg">Connect your wallet to get started</p>
        </div>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Dashboard</h1>
          <p className="text-gray-500 mt-1 font-mono text-sm">{formatAddress(address!)}</p>
        </div>
        <div className="bg-white neo-border-thick rounded-xl px-6 py-4">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">USDC Balance</p>
          <p className="text-2xl font-black text-arc-green font-mono">{formatUsdc(usdcBalance)} <span className="text-sm text-gray-400">USDC</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickCard title="Payment Links" desc="Create shareable payment links" href="/app/payment-links" color="bg-arc-green" icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
        } />
        <QuickCard title="Invoices" desc="Issue & pay invoices on-chain" href="/app/invoices" color="bg-arc-blue" icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        } />
        <QuickCard title="Split Payments" desc="Route revenue to multiple wallets" href="/app/splits" color="bg-arc-lime" icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"><circle cx="7" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><circle cx="7" cy="17" r="3" /><circle cx="17" cy="17" r="3" /></svg>
        } />
        <QuickCard title="Escrow" desc="Time-locked escrow with arbiter" href="/app/escrow" color="bg-arc-orange" icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        } />
      </div>

      <div className="bg-white neo-border-thick rounded-xl p-6">
        <h2 className="text-lg font-black mb-4 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
          Protocol Addresses
        </h2>
        {addrsLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded animate-shimmer" />
            ))}
          </div>
        ) : addresses ? (
          <div className="space-y-0 text-sm font-mono">
            {[
              { label: "PaymentLink", addr: addresses[0] },
              { label: "Invoice", addr: addresses[1] },
              { label: "SplitRouter", addr: addresses[2] },
              { label: "EscrowVault", addr: addresses[3] },
              { label: "FeeManager", addr: addresses[4] },
              { label: "PrivacyShield", addr: addresses[5] },
            ].map(({ label, addr }) => (
              <div key={label} className="flex items-center gap-4 py-2.5 border-b border-gray-100 last:border-0">
                <span className="w-28 font-bold text-gray-400 text-xs uppercase tracking-wider shrink-0">{label}</span>
                <span className="text-gray-700 truncate">{addr}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-500 font-bold text-sm">Factory not deployed</p>
            <p className="text-xs text-red-400 mt-1">Set NEXT_PUBLIC_FACTORY_ADDRESS in .env.local</p>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickCard({ title, desc, href, color, icon }: { title: string; desc: string; href: string; color: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="bg-white neo-border-thick rounded-xl p-5 hover:-translate-y-1 transition-all cursor-pointer group neo-shadow-hover"
    >
      <div className={`w-11 h-11 ${color} rounded-lg neo-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-black text-base">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </a>
  );
}
