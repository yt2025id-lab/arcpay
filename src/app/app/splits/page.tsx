"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { useSplitRouterRead, useSplitRouterWrite, useUserSplits } from "@/hooks/useSplitRouter";
import { useApproveUsdc, useUsdcAllowance, useUsdcBalance } from "@/hooks/usePaymentLink";

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
    <div className="space-y-8">
      <h1 className="text-3xl font-black">Split Payments</h1>
      <CreateSplitForm contractAddress={splitAddr!} />

      <div className="bg-white neo-border-thick rounded-xl p-6">
        <h2 className="text-xl font-black mb-4">My Splits</h2>
        {mySplits && (mySplits as bigint[]).length > 0 ? (
          <div className="space-y-3">
            {(mySplits as bigint[]).map((splitId) => (
              <SplitRow key={splitId.toString()} splitId={splitId} contractAddress={splitAddr!} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No splits yet. Create one above!</p>
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

  const handleSubmit = () => {
    if (!recipients || !bps) return;
    const addrList = recipients.split(",").map((s) => s.trim() as `0x${string}`);
    const bpsList = bps.split(",").map((s) => parseInt(s.trim()));
    createSplit.write(addrList, bpsList, immutable);
  };

  return (
    <div className="bg-white neo-border-thick rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-black text-arc-lime">Create Split</h2>

      <div>
        <label className="block text-sm font-bold mb-1">Recipient Addresses (comma-separated)</label>
        <textarea
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          placeholder="0xAddr1, 0xAddr2, 0xAddr3"
          className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono text-sm h-24 resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">BPS for each (comma-separated, must total 10000)</label>
        <input
          type="text"
          value={bps}
          onChange={(e) => setBps(e.target.value)}
          placeholder="5000, 3000, 2000"
          className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono text-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="immutable"
          checked={immutable}
          onChange={(e) => setImmutable(e.target.checked)}
          className="w-5 h-5 accent-arc-lime"
        />
        <label htmlFor="immutable" className="font-bold">Immutable (cannot update after creation)</label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={createSplit.isPending || !recipients || !bps}
        className="w-full bg-arc-lime text-arc-black font-black py-4 rounded-lg neo-border-thick hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {createSplit.isPending ? "Confirming..." : "Create Split"}
      </button>
    </div>
  );
}

function SplitRow({ splitId, contractAddress }: { splitId: bigint; contractAddress: `0x${string}` }) {
  const { splitData, recipients, bps } = useSplitRouterRead(contractAddress, splitId);
  const { routePayment, updateSplit } = useSplitRouterWrite(contractAddress);
  const approve = useApproveUsdc();
  const { address } = useAccount();
  const [payAmount, setPayAmount] = useState("");

  if (!splitData?.data) return null;
  const d = splitData.data as any;

  const handlePay = async () => {
    if (!payAmount) return;
    const payRaw = BigInt(Math.floor(parseFloat(payAmount) * 1e6));
    await approve.write(contractAddress, payRaw);
    await new Promise((r) => setTimeout(r, 2000));
    routePayment.write(splitId, payRaw);
  };

  return (
    <div className="p-4 border-2 border-arc-black rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-black text-lg">Split #{splitId.toString()}</span>
        <span className="text-sm text-gray-500">Total Received: {(Number(d.totalReceived) / 1e6).toFixed(2)} USDC</span>
      </div>

      {recipients?.data && bps?.data && (
        <div className="space-y-1">
          {(recipients.data as `0x${string}`[]).map((addr, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="font-mono">{addr.slice(0, 8)}...{addr.slice(-4)}</span>
              <span className="font-bold">{((bps.data as number[])[i] / 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="number"
          value={payAmount}
          onChange={(e) => setPayAmount(e.target.value)}
          placeholder="Amount"
          className="flex-1 px-3 py-2 border-2 border-arc-black rounded-lg font-mono text-sm"
        />
        <button
          onClick={handlePay}
          disabled={routePayment.isPending || approve.isPending || !payAmount}
          className="px-4 py-2 bg-arc-lime text-arc-black text-sm font-bold rounded-lg neo-border disabled:opacity-50"
        >
          Route
        </button>
      </div>
    </div>
  );
}
