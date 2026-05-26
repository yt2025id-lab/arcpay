"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { usePaymentLinkWrite, useMerchantLinks, useApproveUsdc, useUsdcAllowance } from "@/hooks/usePaymentLink";
import { USDC_ADDRESS } from "@/config/wagmi";

export default function PaymentLinksPage() {
  const { address, isConnected } = useAccount();
  const { data: addresses } = useFactoryAddresses();
  const paymentLinkAddr = addresses?.[0] as `0x${string}` | undefined;
  const { data: myLinks } = useMerchantLinks(paymentLinkAddr!, address!);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <p className="text-gray-500 text-lg">Connect your wallet to manage payment links</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Payment Links</h1>
      </div>

      <CreateLinkForm contractAddress={paymentLinkAddr!} />

      <div className="bg-white neo-border-thick rounded-xl p-6">
        <h2 className="text-xl font-black mb-4">My Payment Links</h2>
        {myLinks && myLinks.length > 0 ? (
          <div className="space-y-3">
            {(myLinks as `0x${string}`[]).map((linkId) => (
              <LinkRow key={linkId} linkId={linkId} contractAddress={paymentLinkAddr!} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No payment links yet. Create one above!</p>
        )}
      </div>
    </div>
  );
}

function CreateLinkForm({ contractAddress }: { contractAddress: `0x${string}` }) {
  const [amount, setAmount] = useState("");
  const [expiresIn, setExpiresIn] = useState("7");
  const [allowPartial, setAllowPartial] = useState(false);
  const [splitAddr, setSplitAddr] = useState("");
  const [splitBps, setSplitBps] = useState("");
  const { createLink } = usePaymentLinkWrite(contractAddress);
  const approve = useApproveUsdc();
  const { address } = useAccount();
  const { data: allowance } = useUsdcAllowance(address!, contractAddress);

  const handleSubmit = async () => {
    if (!address || !amount) return;
    const amountRaw = BigInt(Math.floor(parseFloat(amount) * 1e6));
    const expiresAt = BigInt(Math.floor(Date.now() / 1000) + parseInt(expiresIn) * 86400);

    const neededAllowance = allowance !== undefined ? amountRaw - (allowance as bigint) : amountRaw;
    if (neededAllowance > 0n) {
      await approve.write(contractAddress, amountRaw * 2n);
      await new Promise((r) => setTimeout(r, 3000));
    }

    const splitAddrs = splitAddr ? [splitAddr as `0x${string}`] : [];
    const splitBpsArr = splitBps ? [parseInt(splitBps)] : [];

    createLink.write({
      merchant: address,
      amount: amountRaw,
      expiresAt,
      allowPartial,
      privacyHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      splitAddrs,
      splitBps: splitBpsArr,
    });
  };

  const isPending = createLink.isPending || approve.isPending;
  const isConfirmed = createLink.receipt?.status === "success";

  return (
    <div className="bg-white neo-border-thick rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-black text-arc-green">Create Payment Link</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">Amount (USDC)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100.00"
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Expires In (days)</label>
          <select
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-bold"
          >
            <option value="1">1 Day</option>
            <option value="3">3 Days</option>
            <option value="7">7 Days</option>
            <option value="30">30 Days</option>
            <option value="90">90 Days</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="allowPartial"
          checked={allowPartial}
          onChange={(e) => setAllowPartial(e.target.checked)}
          className="w-5 h-5 accent-arc-green"
        />
        <label htmlFor="allowPartial" className="font-bold">Allow Partial Payments</label>
      </div>

      <details className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <summary className="font-bold cursor-pointer text-gray-600">Optional: Revenue Split</summary>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Split Address</label>
            <input
              type="text"
              value={splitAddr}
              onChange={(e) => setSplitAddr(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 border-2 border-arc-black rounded-lg font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Split BPS (basis points)</label>
            <input
              type="number"
              value={splitBps}
              onChange={(e) => setSplitBps(e.target.value)}
              placeholder="500 = 5%"
              className="w-full px-4 py-2 border-2 border-arc-black rounded-lg font-mono text-sm"
            />
          </div>
        </div>
      </details>

      <button
        onClick={handleSubmit}
        disabled={isPending || !amount}
        className="w-full bg-arc-green text-arc-black font-black py-4 rounded-lg neo-border-thick hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {isPending ? "Confirming..." : "Create Payment Link"}
      </button>

      {isConfirmed && (
        <div className="bg-arc-green/10 border-2 border-arc-green rounded-lg p-4 text-center font-bold">
          Payment link created successfully!
        </div>
      )}
    </div>
  );
}

function LinkRow({ linkId, contractAddress }: { linkId: `0x${string}`; contractAddress: `0x${string}` }) {
  const { linkData } = usePaymentLinkRead(contractAddress, linkId);
  const { cancelLink, refund } = usePaymentLinkWrite(contractAddress);
  const { address } = useAccount();

  const statusColors: Record<number, string> = {
    0: "bg-arc-green text-white",
    1: "bg-arc-blue text-white",
    2: "bg-gray-400 text-white",
    3: "bg-arc-orange text-white",
    4: "bg-red-500 text-white",
  };

  const statusNames = ["Active", "Paid", "Expired", "Refunded", "Cancelled"];

  if (!linkData?.data) return null;
  const d = linkData.data as any;

  return (
    <div className="flex items-center justify-between p-4 border-2 border-arc-black rounded-lg">
      <div className="space-y-1">
        <p className="font-mono text-sm">{linkId.slice(0, 18)}...</p>
        <p className="font-bold text-lg">{(Number(d.amount) / 1e6).toFixed(2)} USDC</p>
        <p className="text-xs text-gray-500">
          Payer: {d.payer === "0x0000000000000000000000000000000000000000" ? "Waiting..." : `${d.payer.slice(0, 6)}...${d.payer.slice(-4)}`}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[d.status] || "bg-gray-200"}`}>
          {statusNames[d.status] || "Unknown"}
        </span>
        {d.status === 0 && d.merchant === address && (
          <button
            onClick={() => cancelLink.write(linkId)}
            disabled={cancelLink.isPending}
            className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg neo-border hover:bg-red-600 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        {d.status === 1 && d.merchant === address && (
          <button
            onClick={() => refund.write(linkId)}
            disabled={refund.isPending}
            className="px-3 py-1 bg-arc-orange text-white text-xs font-bold rounded-lg neo-border hover:opacity-80 disabled:opacity-50"
          >
            Refund
          </button>
        )}
        <a
          href={`/app/payment-links/${linkId}`}
          className="px-3 py-1 bg-arc-green text-arc-black text-xs font-bold rounded-lg neo-border hover:-translate-y-0.5 transition-transform"
        >
          View
        </a>
      </div>
    </div>
  );
}

import { usePaymentLinkRead } from "@/hooks/usePaymentLink";
