"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { useUsdcBalance } from "@/hooks/usePaymentLink";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { data: addresses, isLoading: addrsLoading } = useFactoryAddresses();

  const paymentLinkAddr = addresses?.[0] as `0x${string}` | undefined;
  const { data: usdcBalance } = useUsdcBalance(address!);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <div className="text-6xl font-black text-arc-green">ArcPay</div>
        <p className="text-gray-500 text-lg">Connect your wallet to get started</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        <div className="bg-white neo-border-thick rounded-xl px-6 py-4">
          <p className="text-xs text-gray-500 font-bold uppercase">USDC Balance</p>
          <p className="text-2xl font-black text-arc-green">
            {usdcBalance ? (Number(usdcBalance) / 1e6).toFixed(2) : "0.00"} USDC
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickCard
          title="Payment Links"
          desc="Create shareable payment links"
          href="/app/payment-links"
          color="bg-arc-green"
        />
        <QuickCard
          title="Invoices"
          desc="Issue & pay invoices on-chain"
          href="/app/invoices"
          color="bg-arc-blue"
        />
        <QuickCard
          title="Split Payments"
          desc="Route revenue to multiple wallets"
          href="/app/splits"
          color="bg-arc-lime"
        />
        <QuickCard
          title="Escrow"
          desc="Time-locked escrow with arbiter"
          href="/app/escrow"
          color="bg-arc-orange"
        />
      </div>

      <div className="bg-white neo-border-thick rounded-xl p-6">
        <h2 className="text-xl font-black mb-4">Protocol Addresses</h2>
        {addrsLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : addresses ? (
          <div className="space-y-2 text-sm font-mono">
            <AddressRow label="PaymentLink" address={addresses[0]} />
            <AddressRow label="Invoice" address={addresses[1]} />
            <AddressRow label="SplitRouter" address={addresses[2]} />
            <AddressRow label="EscrowVault" address={addresses[3]} />
            <AddressRow label="FeeManager" address={addresses[4]} />
            <AddressRow label="PrivacyShield" address={addresses[5]} />
          </div>
        ) : (
          <p className="text-red-500 font-bold">
            Factory not deployed. Set NEXT_PUBLIC_FACTORY_ADDRESS in .env.local
          </p>
        )}
      </div>
    </div>
  );
}

function QuickCard({
  title,
  desc,
  href,
  color,
}: {
  title: string;
  desc: string;
  href: string;
  color: string;
}) {
  return (
    <a
      href={href}
      className="bg-white neo-border-thick rounded-xl p-6 hover:-translate-y-1 transition-transform cursor-pointer"
    >
      <div className={`w-10 h-10 ${color} rounded-lg neo-border mb-3`} />
      <h3 className="font-black text-lg">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </a>
  );
}

function AddressRow({ label, address }: { label: string; address: string }) {
  return (
    <div className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="w-32 font-bold text-gray-600">{label}</span>
      <span className="text-gray-800">{address.slice(0, 10)}...{address.slice(-8)}</span>
    </div>
  );
}
