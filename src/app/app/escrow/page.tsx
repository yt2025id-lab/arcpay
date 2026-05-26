"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { useEscrowRead, useEscrowWrite, useUserEscrows } from "@/hooks/useEscrowVault";
import { useApproveUsdc, useUsdcAllowance } from "@/hooks/usePaymentLink";
import { formatAddress, formatUsdc } from "@/lib/utils";
import { useTxStatus, TxToast } from "@/lib/useTxStatus";
import { useWalletReady } from "@/lib/useWalletReady";

export default function EscrowPage() {
  const { address, isConnected } = useAccount();
  const { ready } = useWalletReady();
  const { data: addresses } = useFactoryAddresses();
  const escrowAddr = addresses?.[3] as `0x${string}` | undefined;
  const { data: myEscrows } = useUserEscrows(escrowAddr!, address!);

  if (!ready) {
    return <div className="flex items-center justify-center min-h-[80vh]"><div className="w-8 h-8 border-3 border-arc-green border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <p className="text-gray-500 text-lg">Connect your wallet to manage escrows</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <h1 className="text-3xl font-black">Escrow</h1>
      <CreateEscrowForm contractAddress={escrowAddr!} />
      <div className="bg-white neo-border-thick rounded-xl p-6">
        <h2 className="text-lg font-black mb-4">My Escrows</h2>
        {myEscrows && (myEscrows as `0x${string}`[]).length > 0 ? (
          <div className="space-y-3">
            {(myEscrows as `0x${string}`[]).map((escrowId) => <EscrowRow key={escrowId} escrowId={escrowId} contractAddress={escrowAddr!} />)}
          </div>
        ) : (
          <EmptyState message="No escrows yet" hint="Create one above to get started" />
        )}
      </div>
    </div>
  );
}

function CreateEscrowForm({ contractAddress }: { contractAddress: `0x${string}` }) {
  const [seller, setSeller] = useState("");
  const [amount, setAmount] = useState("");
  const [releaseDays, setReleaseDays] = useState("7");
  const [arbiter, setArbiter] = useState("");
  const { createEscrow } = useEscrowWrite(contractAddress);
  const tx = useTxStatus(createEscrow);

  const handleCreate = () => {
    if (!seller || !amount) return;
    const amountRaw = BigInt(Math.floor(parseFloat(amount) * 1e6));
    const releaseAt = BigInt(Math.floor(Date.now() / 1000) + parseInt(releaseDays) * 86400);
    createEscrow.write(
      seller as `0x${string}`,
      amountRaw,
      releaseAt,
      (arbiter || "0x0000000000000000000000000000000000000000") as `0x${string}`
    );
  };

  return (
    <div className="bg-white neo-border-thick rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-black text-arc-orange flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        Create Escrow
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Seller Address" value={seller} onChange={setSeller} placeholder="0x..." mono />
        <InputField label="Amount" suffix="USDC" type="number" value={amount} onChange={setAmount} placeholder="1000.00" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Release After</label>
          <select value={releaseDays} onChange={(e) => setReleaseDays(e.target.value)}
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-bold bg-white focus:outline-none focus:ring-2 focus:ring-arc-orange/30">
            <option value="1">1 Day</option><option value="3">3 Days</option><option value="7">7 Days</option><option value="14">14 Days</option><option value="30">30 Days</option>
          </select>
        </div>
        <InputField label="Arbiter (optional)" value={arbiter} onChange={setArbiter} placeholder="0x..." mono />
      </div>
      <button onClick={handleCreate} disabled={createEscrow.isPending || !seller || !amount}
        className="w-full bg-arc-orange text-white font-black py-3.5 rounded-lg neo-border-thick hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-base">
        {createEscrow.isPending ? "Confirm in wallet..." : "Create Escrow"}
      </button>
      <TxToast status={tx.status} onDismiss={tx.dismiss} />
    </div>
  );
}

function EscrowRow({ escrowId, contractAddress }: { escrowId: `0x${string}`; contractAddress: `0x${string}` }) {
  const { escrowData } = useEscrowRead(contractAddress, escrowId);
  const { fundEscrow, release, refund, dispute } = useEscrowWrite(contractAddress);
  const approve = useApproveUsdc();
  const { data: allowance } = useUsdcAllowance(useAccount().address!, contractAddress);
  const { address } = useAccount();

  const statusConfig: Record<number, { label: string; bg: string; dot: string }> = {
    0: { label: "Created", bg: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
    1: { label: "Funded", bg: "bg-arc-blue/10 text-arc-blue", dot: "bg-arc-blue" },
    2: { label: "Released", bg: "bg-arc-green/10 text-arc-green", dot: "bg-arc-green" },
    3: { label: "Refunded", bg: "bg-arc-orange/10 text-arc-orange", dot: "bg-arc-orange" },
    4: { label: "Disputed", bg: "bg-arc-purple/10 text-arc-purple", dot: "bg-arc-purple" },
  };

  if (!escrowData?.data) return <div className="h-20 bg-gray-50 rounded-lg animate-shimmer" />;
  const d = escrowData.data as any;
  const s = statusConfig[d.status] || statusConfig[0];
  const isBuyer = d.buyer?.toLowerCase() === address?.toLowerCase();
  const isSeller = d.seller?.toLowerCase() === address?.toLowerCase();

  const handleFund = async () => {
    const amountRaw = BigInt(d.amount);
    const neededAllowance = allowance ? amountRaw - (allowance as bigint) : amountRaw;
    if (neededAllowance > 0n) {
      await approve.write(contractAddress, amountRaw * 2n);
      await new Promise((r) => setTimeout(r, 3000));
    }
    fundEscrow.write(escrowId);
  };

  return (
    <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-arc-black/30 transition-colors space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-gray-400 truncate">{escrowId}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${s.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
        </span>
      </div>
      <p className="font-black text-lg">{formatUsdc(d.amount)} <span className="text-sm text-gray-400 font-normal">USDC</span></p>
      <div className="text-xs text-gray-400 space-y-1">
        <p>Buyer: {formatAddress(d.buyer)} &nbsp;|&nbsp; Seller: {formatAddress(d.seller)}</p>
        {d.releaseAt > 0n && <p>Release: {new Date(Number(d.releaseAt) * 1000).toLocaleDateString()}</p>}
        {d.arbiter !== "0x0000000000000000000000000000000000000000" && <p>Arbiter: {formatAddress(d.arbiter)}</p>}
      </div>
      <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-200">
        {d.status === 0 && isBuyer && (
          <button onClick={handleFund} disabled={fundEscrow.isPending || approve.isPending}
            className="px-4 py-2 bg-arc-blue text-white text-xs font-bold rounded-lg border-2 border-arc-blue hover:bg-arc-blue/80 disabled:opacity-50">
            {fundEscrow.isPending || approve.isPending ? "Approving..." : "Fund Escrow"}
          </button>
        )}
        {d.status === 1 && isBuyer && (
          <button onClick={() => release.write(escrowId)} disabled={release.isPending}
            className="px-4 py-2 bg-arc-green text-white text-xs font-bold rounded-lg border-2 border-arc-green hover:bg-arc-green/80 disabled:opacity-50">Release</button>
        )}
        {d.status === 1 && (isBuyer || isSeller) && (
          <>
            <button onClick={() => refund.write(escrowId)} disabled={refund.isPending}
              className="px-4 py-2 bg-arc-orange/10 text-arc-orange text-xs font-bold rounded-lg border-2 border-arc-orange/30 hover:border-arc-orange disabled:opacity-50">Refund</button>
            <button onClick={() => dispute.write(escrowId)} disabled={dispute.isPending}
              className="px-4 py-2 bg-arc-purple/10 text-arc-purple text-xs font-bold rounded-lg border-2 border-arc-purple/30 hover:border-arc-purple disabled:opacity-50">Dispute</button>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-3 flex items-center justify-center text-gray-300">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
      </div>
      <p className="font-bold text-gray-400 text-sm">{message}</p>
      {hint && <p className="text-xs text-gray-300 mt-1">{hint}</p>}
    </div>
  );
}

function InputField({ label, suffix, type = "text", value, onChange, placeholder, mono = false }: {
  label: string; suffix?: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full px-4 py-3 border-2 border-arc-black rounded-lg ${mono ? "font-mono text-sm" : "font-bold"} bg-white focus:outline-none focus:ring-2 focus:ring-arc-orange/30 ${suffix ? "pr-16" : ""}`}
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}
