"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { usePaymentLinkRead, usePaymentLinkWrite, useApproveUsdc, useUsdcAllowance, useUsdcBalance } from "@/hooks/usePaymentLink";
import { formatAddress, formatUsdc } from "@/lib/utils";
import { useTxStatus, TxToast } from "@/lib/useTxStatus";

export default function PayLinkPage() {
  const params = useParams();
  const linkId = params.id as `0x${string}`;
  const { data: addresses } = useFactoryAddresses();
  const paymentLinkAddr = addresses?.[0] as `0x${string}` | undefined;

  if (!paymentLinkAddr) return <div className="p-8 text-gray-400 text-center">Loading...</div>;
  return <PayLinkDetail linkId={linkId} contractAddress={paymentLinkAddr} />;
}

function PayLinkDetail({ linkId, contractAddress }: { linkId: `0x${string}`; contractAddress: `0x${string}` }) {
  const { address, isConnected } = useAccount();
  const { linkData } = usePaymentLinkRead(contractAddress, linkId);
  const { pay } = usePaymentLinkWrite(contractAddress);
  const approve = useApproveUsdc();
  const { data: allowance } = useUsdcAllowance(address!, contractAddress);
  const { data: balance } = useUsdcBalance(address!);
  const [payAmount, setPayAmount] = useState("");
  const tx = useTxStatus(pay);

  if (!linkData?.data) return <div className="p-8 text-gray-400 text-center">Loading link data...</div>;

  const d = linkData.data as any;
  const amount = Number(d.amount) / 1e6;
  const paidAmount = Number(d.paidAmount) / 1e6;
  const remaining = amount - paidAmount;
  const isActive = d.status === 0;

  const statusConfig: Record<number, { label: string; bg: string; dot: string }> = {
    0: { label: "Active", bg: "bg-arc-green/10 text-arc-green", dot: "bg-arc-green" },
    1: { label: "Paid", bg: "bg-arc-blue/10 text-arc-blue", dot: "bg-arc-blue" },
    2: { label: "Expired", bg: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
    3: { label: "Refunded", bg: "bg-arc-orange/10 text-arc-orange", dot: "bg-arc-orange" },
    4: { label: "Cancelled", bg: "bg-red-50 text-red-500", dot: "bg-red-500" },
  };
  const s = statusConfig[d.status] || statusConfig[2];

  const handlePay = async () => {
    if (!payAmount) return;
    const payRaw = BigInt(Math.floor(parseFloat(payAmount) * 1e6));
    const neededAllowance = allowance ? payRaw - (allowance as bigint) : payRaw;
    if (neededAllowance > 0n) {
      await approve.write(contractAddress, payRaw * 2n);
      await new Promise((r) => setTimeout(r, 3000));
    }
    pay.write(linkId, payRaw);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-slide-up">
      <a href="/app/payment-links" className="text-sm font-bold text-gray-400 hover:text-arc-green transition-colors inline-flex items-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        Payment Links
      </a>

      <div className="bg-white neo-border-thick rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold ${s.bg}`}>
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            {s.label}
          </span>
          <h1 className="text-5xl font-black mt-5 font-mono">{formatUsdc(d.amount)}</h1>
          <p className="text-gray-400 font-bold mt-1">USDC</p>
          {d.allowPartial && <p className="text-xs text-arc-blue font-bold mt-2 bg-arc-blue/10 rounded-full px-3 py-1 inline-block">Partial payments allowed</p>}
        </div>

        {paidAmount > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 font-bold">Payment progress</span>
              <span className="font-mono font-bold">{paidAmount.toFixed(2)} / {amount.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-arc-green h-2 rounded-full transition-all" style={{ width: `${Math.min((paidAmount / amount) * 100, 100)}%` }} />
            </div>
          </div>
        )}

        <div className="space-y-0 text-sm">
          <InfoRow label="Merchant" value={formatAddress(d.merchant)} />
          <InfoRow label="Created" value={d.createdAt > 0n ? new Date(Number(d.createdAt) * 1000).toLocaleDateString() : "—"} />
          <InfoRow label="Expires" value={d.expiresAt > 0n ? new Date(Number(d.expiresAt) * 1000).toLocaleDateString() : "Never"} />
        </div>

        {isActive && isConnected && (
          <div className="space-y-4 pt-4 border-t-2 border-gray-100">
            <h3 className="font-black text-base">Pay This Link</h3>
            <div className="relative">
              <input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)}
                placeholder={d.allowPartial ? remaining.toFixed(2) : amount.toFixed(2)}
                className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono text-lg bg-white focus:outline-none focus:ring-2 focus:ring-arc-green/30 pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">USDC</span>
            </div>
            {balance !== undefined && (
              <p className="text-xs text-gray-400">Balance: {formatUsdc(balance)} USDC</p>
            )}
            <button onClick={handlePay} disabled={pay.isPending || approve.isPending || !payAmount}
              className="w-full bg-arc-green text-arc-black font-black py-3.5 rounded-lg neo-border-thick hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-base">
              {pay.isPending || approve.isPending ? "Confirm in wallet..." : `Pay ${payAmount || "0"} USDC`}
            </button>
          </div>
        )}

        {isActive && !isConnected && (
          <div className="text-center pt-4 border-t-2 border-gray-100">
            <p className="text-gray-400 mb-4 text-sm">Connect wallet to pay this link</p>
            <ConnectButton />
          </div>
        )}

        {!isActive && (
          <div className="text-center py-4 text-gray-400 text-sm font-bold bg-gray-50 rounded-lg">
            This link is {s.label.toLowerCase()} and cannot be paid.
          </div>
        )}
      </div>

      <TxToast status={tx.status} onDismiss={tx.dismiss} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="font-bold text-gray-400 text-xs uppercase tracking-wider">{label}</span>
      <span className="font-mono font-bold">{value}</span>
    </div>
  );
}
