"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { useSplitRouterRead, useSplitRouterWrite, useUserSplits } from "@/hooks/useSplitRouter";
import { useApproveUsdc } from "@/hooks/usePaymentLink";
import { formatUsdc } from "@/lib/utils";
import { useTxStatus, TxToast } from "@/lib/useTxStatus";

export default function SplitsPage() {
  const { address, isConnected } = useAccount();
  const { data: addresses } = useFactoryAddresses();
  const splitAddr = addresses?.[2] as `0x${string}` | undefined;
  const { data: mySplits } = useUserSplits(splitAddr!, address!);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <p className="text-gray-500 text-lg">Connect your wallet to manage splits</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <h1 className="text-3xl font-black">Split Payments</h1>
      <CreateSplitForm contractAddress={splitAddr!} />
      <div className="bg-white neo-border-thick rounded-xl p-6">
        <h2 className="text-lg font-black mb-4">My Splits</h2>
        {mySplits && (mySplits as bigint[]).length > 0 ? (
          <div className="space-y-3">
            {(mySplits as bigint[]).map((splitId) => <SplitRow key={splitId.toString()} splitId={splitId} contractAddress={splitAddr!} />)}
          </div>
        ) : (
          <EmptyState message="No splits yet" hint="Create one above to get started" />
        )}
      </div>
    </div>
  );
}

function CreateSplitForm({ contractAddress }: { contractAddress: `0x${string}` }) {
  const [recipients, setRecipients] = useState("");
  const [bps, setBps] = useState("");
  const [immutable, setImmutable] = useState(false);
  const { createSplit } = useSplitRouterWrite(contractAddress);
  const tx = useTxStatus(createSplit);

  const handleSubmit = () => {
    if (!recipients || !bps) return;
    const addrList = recipients.split(",").map((s) => s.trim() as `0x${string}`);
    const bpsList = bps.split(",").map((s) => parseInt(s.trim()));
    createSplit.write(addrList, bpsList, immutable);
  };

  return (
    <div className="bg-white neo-border-thick rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-black text-arc-lime flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Create Split
      </h2>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Recipient Addresses (comma-separated)</label>
        <textarea value={recipients} onChange={(e) => setRecipients(e.target.value)} placeholder="0xAddr1, 0xAddr2, 0xAddr3"
          className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono text-sm h-20 resize-none bg-white focus:outline-none focus:ring-2 focus:ring-arc-lime/30" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">BPS for each (comma-separated, must total 10000)</label>
        <input type="text" value={bps} onChange={(e) => setBps(e.target.value)} placeholder="5000, 3000, 2000"
          className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-arc-lime/30" />
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={immutable} onChange={(e) => setImmutable(e.target.checked)} className="w-5 h-5 accent-arc-lime rounded" />
        <span className="font-bold text-sm">Immutable (cannot update after creation)</span>
      </label>
      <button onClick={handleSubmit} disabled={createSplit.isPending || !recipients || !bps}
        className="w-full bg-arc-lime text-arc-black font-black py-3.5 rounded-lg neo-border-thick hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-base">
        {createSplit.isPending ? "Confirm in wallet..." : "Create Split"}
      </button>
      <TxToast status={tx.status} onDismiss={tx.dismiss} />
    </div>
  );
}

function SplitRow({ splitId, contractAddress }: { splitId: bigint; contractAddress: `0x${string}` }) {
  const { splitData, recipients, bps } = useSplitRouterRead(contractAddress, splitId);
  const { routePayment } = useSplitRouterWrite(contractAddress);
  const approve = useApproveUsdc();
  const { address } = useAccount();
  const [payAmount, setPayAmount] = useState("");

  if (!splitData?.data) return <div className="h-20 bg-gray-50 rounded-lg animate-shimmer" />;
  const d = splitData.data as any;

  const handlePay = async () => {
    if (!payAmount) return;
    const payRaw = BigInt(Math.floor(parseFloat(payAmount) * 1e6));
    await approve.write(contractAddress, payRaw);
    await new Promise((r) => setTimeout(r, 2000));
    routePayment.write(splitId, payRaw);
  };

  return (
    <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-arc-black/30 transition-colors space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-black">Split #{splitId.toString()}</span>
        <span className="text-xs text-gray-400 font-mono">{formatUsdc(d.totalReceived)} USDC received</span>
      </div>
      {recipients?.data && bps?.data && (
        <div className="space-y-1.5">
          {(recipients.data as `0x${string}`[]).map((addr, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="font-mono text-gray-600">{addr.slice(0, 8)}...{addr.slice(-4)}</span>
              <span className="font-bold">{((bps.data as number[])[i] / 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <div className="relative flex-1">
          <input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="Amount"
            className="w-full px-3 py-2 border-2 border-arc-black rounded-lg font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-arc-lime/30 pr-14" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">USDC</span>
        </div>
        <button onClick={handlePay} disabled={routePayment.isPending || approve.isPending || !payAmount}
          className="px-4 py-2 bg-arc-lime text-arc-black text-sm font-bold rounded-lg border-2 border-arc-lime hover:bg-arc-lime/80 disabled:opacity-50">Route</button>
      </div>
    </div>
  );
}

function EmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-3 flex items-center justify-center text-gray-300">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="7" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><circle cx="7" cy="17" r="3" /><circle cx="17" cy="17" r="3" /></svg>
      </div>
      <p className="font-bold text-gray-400 text-sm">{message}</p>
      {hint && <p className="text-xs text-gray-300 mt-1">{hint}</p>}
    </div>
  );
}
