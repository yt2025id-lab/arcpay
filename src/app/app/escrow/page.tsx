"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { useEscrowRead, useEscrowWrite, useUserEscrows } from "@/hooks/useEscrowVault";
import { useApproveUsdc, useUsdcAllowance, useUsdcBalance } from "@/hooks/usePaymentLink";

export default function EscrowPage() {
  const { address, isConnected } = useAccount();
  const { data: addresses } = useFactoryAddresses();
  const escrowAddr = addresses?.[3] as `0x${string}` | undefined;
  const { data: myEscrows } = useUserEscrows(escrowAddr!, address!);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <p className="text-gray-500 text-lg">Connect your wallet to manage escrows</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black">Escrow</h1>
      <CreateEscrowForm contractAddress={escrowAddr!} />

      <div className="bg-white neo-border-thick rounded-xl p-6">
        <h2 className="text-xl font-black mb-4">My Escrows</h2>
        {myEscrows && (myEscrows as `0x${string}`[]).length > 0 ? (
          <div className="space-y-3">
            {(myEscrows as `0x${string}`[]).map((escrowId) => (
              <EscrowRow key={escrowId} escrowId={escrowId} contractAddress={escrowAddr!} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No escrows yet. Create one above!</p>
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
  const { createEscrow, fundEscrow } = useEscrowWrite(contractAddress);
  const approve = useApproveUsdc();
  const { address } = useAccount();

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
    <div className="bg-white neo-border-thick rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-black text-arc-orange">Create Escrow</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">Seller Address</label>
          <input
            type="text"
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Amount (USDC)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000.00"
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono text-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">Release After (days)</label>
          <select
            value={releaseDays}
            onChange={(e) => setReleaseDays(e.target.value)}
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-bold"
          >
            <option value="1">1 Day</option>
            <option value="3">3 Days</option>
            <option value="7">7 Days</option>
            <option value="14">14 Days</option>
            <option value="30">30 Days</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Arbiter Address (optional)</label>
          <input
            type="text"
            value={arbiter}
            onChange={(e) => setArbiter(e.target.value)}
            placeholder="0x... or leave empty"
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono text-sm"
          />
        </div>
      </div>

      <button
        onClick={handleCreate}
        disabled={createEscrow.isPending || !seller || !amount}
        className="w-full bg-arc-orange text-white font-black py-4 rounded-lg neo-border-thick hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {createEscrow.isPending ? "Confirming..." : "Create Escrow"}
      </button>

      {createEscrow.receipt?.status === "success" && (
        <div className="bg-arc-orange/10 border-2 border-arc-orange rounded-lg p-4 text-center font-bold">
          Escrow created! Fund it below after approval.
        </div>
      )}
    </div>
  );
}

function EscrowRow({ escrowId, contractAddress }: { escrowId: `0x${string}`; contractAddress: `0x${string}` }) {
  const { escrowData } = useEscrowRead(contractAddress, escrowId);
  const { fundEscrow, release, refund, dispute } = useEscrowWrite(contractAddress);
  const approve = useApproveUsdc();
  const { data: allowance } = useUsdcAllowance(useAccount().address!, contractAddress);
  const { address } = useAccount();

  const statusNames = ["Created", "Funded", "Released", "Refunded", "Disputed"];
  const statusColors: Record<number, string> = {
    0: "bg-gray-300", 1: "bg-arc-blue", 2: "bg-arc-green", 3: "bg-arc-orange", 4: "bg-arc-purple",
  };

  if (!escrowData?.data) return null;
  const d = escrowData.data as any;
  const amount = Number(d.amount) / 1e6;
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
    <div className="p-4 border-2 border-arc-black rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm">{escrowId.slice(0, 18)}...</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusColors[d.status] || "bg-gray-200"}`}>
          {statusNames[d.status] || "Unknown"}
        </span>
      </div>

      <p className="font-black text-lg">{amount.toFixed(2)} USDC</p>
      <div className="text-xs text-gray-500 space-y-1">
        <p>Buyer: {d.buyer?.slice(0, 6)}...{d.buyer?.slice(-4)}</p>
        <p>Seller: {d.seller?.slice(0, 6)}...{d.seller?.slice(-4)}</p>
        {d.releaseAt > 0n && <p>Release: {new Date(Number(d.releaseAt) * 1000).toLocaleDateString()}</p>}
        {d.arbiter !== "0x0000000000000000000000000000000000000000" && (
          <p>Arbiter: {d.arbiter?.slice(0, 6)}...{d.arbiter?.slice(-4)}</p>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {d.status === 0 && isBuyer && (
          <button
            onClick={handleFund}
            disabled={fundEscrow.isPending || approve.isPending}
            className="px-4 py-2 bg-arc-blue text-white text-sm font-bold rounded-lg neo-border disabled:opacity-50"
          >
            {fundEscrow.isPending || approve.isPending ? "Approving..." : "Fund Escrow"}
          </button>
        )}
        {d.status === 1 && isBuyer && (
          <button
            onClick={() => release.write(escrowId)}
            disabled={release.isPending}
            className="px-4 py-2 bg-arc-green text-white text-sm font-bold rounded-lg neo-border disabled:opacity-50"
          >
            Release
          </button>
        )}
        {d.status === 1 && (isBuyer || isSeller) && (
          <button
            onClick={() => refund.write(escrowId)}
            disabled={refund.isPending}
            className="px-4 py-2 bg-arc-orange text-white text-sm font-bold rounded-lg neo-border disabled:opacity-50"
          >
            Refund
          </button>
        )}
        {d.status === 1 && (isBuyer || isSeller) && (
          <button
            onClick={() => dispute.write(escrowId)}
            disabled={dispute.isPending}
            className="px-4 py-2 bg-arc-purple text-white text-sm font-bold rounded-lg neo-border disabled:opacity-50"
          >
            Dispute
          </button>
        )}
      </div>
    </div>
  );
}
