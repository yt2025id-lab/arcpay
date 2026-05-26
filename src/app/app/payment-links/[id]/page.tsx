"use client";

import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { usePaymentLinkRead, usePaymentLinkWrite, useApproveUsdc, useUsdcAllowance, useUsdcBalance } from "@/hooks/usePaymentLink";

export default function PayLinkPage() {
  const params = useParams();
  const linkId = params.id as `0x${string}`;
  const { address, isConnected } = useAccount();
  const { data: addresses } = useFactoryAddresses();
  const paymentLinkAddr = addresses?.[0] as `0x${string}` | undefined;

  if (!paymentLinkAddr) {
    return <div className="p-8 text-gray-500">Loading contract addresses...</div>;
  }

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

  if (!linkData?.data) {
    return <div className="p-8 text-gray-500">Loading link data...</div>;
  }

  const d = linkData.data as any;
  const amount = Number(d.amount) / 1e6;
  const paidAmount = Number(d.paidAmount) / 1e6;
  const remaining = amount - paidAmount;
  const isActive = d.status === 0;
  const isExpired = d.status === 2;

  const statusNames = ["Active", "Paid", "Expired", "Refunded", "Cancelled"];
  const statusColors: Record<number, string> = {
    0: "bg-arc-green", 1: "bg-arc-blue", 2: "bg-gray-400", 3: "bg-arc-orange", 4: "bg-red-500",
  };

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
    <div className="max-w-lg mx-auto space-y-6">
      <a href="/app/payment-links" className="text-sm font-bold text-gray-500 hover:text-arc-green">← Back to Payment Links</a>

      <div className="bg-white neo-border-thick rounded-xl p-8 space-y-6">
        <div className="text-center">
          <span className={`inline-block px-4 py-1 rounded-full text-white text-sm font-bold ${statusColors[d.status]}`}>
            {statusNames[d.status]}
          </span>
          <h1 className="text-4xl font-black mt-4">{amount.toFixed(2)} USDC</h1>
          {d.allowPartial && <p className="text-sm text-gray-500 mt-1">Partial payments allowed</p>}
        </div>

        <div className="space-y-3 text-sm">
          <InfoRow label="Link ID" value={`${linkId.slice(0, 10)}...${linkId.slice(-8)}`} />
          <InfoRow label="Merchant" value={`${d.merchant.slice(0, 6)}...${d.merchant.slice(-4)}`} />
          <InfoRow label="Created" value={new Date(Number(d.createdAt) * 1000).toLocaleDateString()} />
          <InfoRow label="Expires" value={new Date(Number(d.expiresAt) * 1000).toLocaleDateString()} />
          <InfoRow label="Paid" value={`${paidAmount.toFixed(2)} / ${amount.toFixed(2)} USDC`} />
        </div>

        {isActive && isConnected && (
          <div className="space-y-4 pt-4 border-t-2 border-gray-100">
            <h3 className="font-black text-lg">Pay This Link</h3>
            <div>
              <label className="block text-sm font-bold mb-1">Amount (USDC)</label>
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder={d.allowPartial ? remaining.toFixed(2) : amount.toFixed(2)}
                className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono text-lg"
              />
              {balance !== undefined && (
                <p className="text-xs text-gray-500 mt-1">
                  Balance: {(Number(balance) / 1e6).toFixed(2)} USDC
                </p>
              )}
            </div>
            <button
              onClick={handlePay}
              disabled={pay.isPending || approve.isPending || !payAmount}
              className="w-full bg-arc-green text-arc-black font-black py-4 rounded-lg neo-border-thick hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {pay.isPending || approve.isPending ? "Confirming..." : `Pay ${payAmount || "0"} USDC`}
            </button>
          </div>
        )}

        {isActive && !isConnected && (
          <div className="text-center pt-4 border-t-2 border-gray-100">
            <p className="text-gray-500 mb-4">Connect wallet to pay this link</p>
            <ConnectButton />
          </div>
        )}

        {!isActive && (
          <div className="text-center py-4 text-gray-500 font-bold">
            This link is {statusNames[d.status]?.toLowerCase()} and cannot be paid.
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="font-bold text-gray-500">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}
