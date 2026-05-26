"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { usePaymentLinkRead, usePaymentLinkWrite, useMerchantLinks, useApproveUsdc, useUsdcAllowance } from "@/hooks/usePaymentLink";
import { formatAddress, formatUsdc } from "@/lib/utils";
import { useTxStatus, TxToast } from "@/lib/useTxStatus";

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
    <div className="space-y-8 animate-slide-up">
      <h1 className="text-3xl font-black">Payment Links</h1>
      <CreateLinkForm contractAddress={paymentLinkAddr!} />
      <div className="bg-white neo-border-thick rounded-xl p-6">
        <h2 className="text-lg font-black mb-4">My Payment Links</h2>
        {myLinks && myLinks.length > 0 ? (
          <div className="space-y-3">
            {(myLinks as `0x${string}`[]).map((linkId) => (
              <LinkRow key={linkId} linkId={linkId} contractAddress={paymentLinkAddr!} />
            ))}
          </div>
        ) : (
          <EmptyState icon="link" message="No payment links yet" hint="Create one above to get started" />
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
  const tx = useTxStatus(createLink);

  const handleSubmit = async () => {
    if (!address || !amount) return;
    const amountRaw = BigInt(Math.floor(parseFloat(amount) * 1e6));
    const expiresAt = BigInt(Math.floor(Date.now() / 1000) + parseInt(expiresIn) * 86400);
    const neededAllowance = allowance !== undefined ? amountRaw - (allowance as bigint) : amountRaw;
    if (neededAllowance > 0n) {
      await approve.write(contractAddress, amountRaw * 2n);
      await new Promise((r) => setTimeout(r, 3000));
    }
    createLink.write({
      merchant: address,
      amount: amountRaw,
      expiresAt,
      allowPartial,
      privacyHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      splitAddrs: splitAddr ? [splitAddr as `0x${string}`] : [],
      splitBps: splitBps ? [parseInt(splitBps)] : [],
    });
  };

  const isPending = createLink.isPending || approve.isPending;

  return (
    <div className="bg-white neo-border-thick rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-black text-arc-green flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Create Payment Link
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Amount" suffix="USDC" type="number" value={amount} onChange={setAmount} placeholder="100.00" />
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Expires In</label>
          <select value={expiresIn} onChange={(e) => setExpiresIn(e.target.value)} className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-bold bg-white focus:outline-none focus:ring-2 focus:ring-arc-green/30">
            <option value="1">1 Day</option><option value="3">3 Days</option><option value="7">7 Days</option><option value="30">30 Days</option><option value="90">90 Days</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={allowPartial} onChange={(e) => setAllowPartial(e.target.checked)} className="w-5 h-5 accent-arc-green rounded" />
        <span className="font-bold text-sm">Allow Partial Payments</span>
      </label>
      <details className="border-2 border-dashed border-gray-200 rounded-lg p-4">
        <summary className="font-bold cursor-pointer text-gray-500 text-sm">+ Optional: Revenue Split</summary>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Split Address" value={splitAddr} onChange={setSplitAddr} placeholder="0x..." mono />
          <InputField label="Split BPS" value={splitBps} onChange={setSplitBps} placeholder="500 = 5%" mono />
        </div>
      </details>
      <button onClick={handleSubmit} disabled={isPending || !amount} className="w-full bg-arc-green text-arc-black font-black py-3.5 rounded-lg neo-border-thick hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-base">
        {isPending ? "Confirm in wallet..." : "Create Payment Link"}
      </button>
      <TxToast status={tx.status} onDismiss={tx.dismiss} />
    </div>
  );
}

function LinkRow({ linkId, contractAddress }: { linkId: `0x${string}`; contractAddress: `0x${string}` }) {
  const { linkData } = usePaymentLinkRead(contractAddress, linkId);
  const { cancelLink, refund } = usePaymentLinkWrite(contractAddress);
  const { address } = useAccount();

  const statusConfig: Record<number, { label: string; bg: string; dot: string }> = {
    0: { label: "Active", bg: "bg-arc-green/10 text-arc-green", dot: "bg-arc-green" },
    1: { label: "Paid", bg: "bg-arc-blue/10 text-arc-blue", dot: "bg-arc-blue" },
    2: { label: "Expired", bg: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
    3: { label: "Refunded", bg: "bg-arc-orange/10 text-arc-orange", dot: "bg-arc-orange" },
    4: { label: "Cancelled", bg: "bg-red-50 text-red-500", dot: "bg-red-500" },
  };

  if (!linkData?.data) return <div className="h-16 bg-gray-50 rounded-lg animate-shimmer" />;
  const d = linkData.data as any;
  const s = statusConfig[d.status] || statusConfig[2];

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-arc-black/30 transition-colors">
      <div className="space-y-1 min-w-0">
        <p className="font-mono text-xs text-gray-400 truncate">{linkId}</p>
        <p className="font-black text-lg">{formatUsdc(d.amount)} <span className="text-sm text-gray-400 font-normal">USDC</span></p>
        <p className="text-xs text-gray-400">
          {d.payer === "0x0000000000000000000000000000000000000000" ? "Waiting for payer..." : `Paid by ${formatAddress(d.payer)}`}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${s.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
        {d.status === 0 && d.merchant === address && (
          <button onClick={() => cancelLink.write(linkId)} disabled={cancelLink.isPending} className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-bold rounded-lg border-2 border-red-200 hover:border-red-400 transition-colors disabled:opacity-50">Cancel</button>
        )}
        {d.status === 1 && d.merchant === address && (
          <button onClick={() => refund.write(linkId)} disabled={refund.isPending} className="px-3 py-1.5 bg-arc-orange/10 text-arc-orange text-xs font-bold rounded-lg border-2 border-arc-orange/30 hover:border-arc-orange transition-colors disabled:opacity-50">Refund</button>
        )}
        <a href={`/app/payment-links/${linkId}`} className="px-3 py-1.5 bg-arc-green/10 text-arc-green text-xs font-bold rounded-lg border-2 border-arc-green/30 hover:border-arc-green transition-colors">View</a>
      </div>
    </div>
  );
}

function EmptyState({ icon, message, hint }: { icon: string; message: string; hint: string }) {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-3 flex items-center justify-center text-gray-300">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
      </div>
      <p className="font-bold text-gray-400">{message}</p>
      <p className="text-xs text-gray-300 mt-1">{hint}</p>
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
          className={`w-full px-4 py-3 border-2 border-arc-black rounded-lg ${mono ? "font-mono" : "font-bold"} text-lg bg-white focus:outline-none focus:ring-2 focus:ring-arc-green/30 ${suffix ? "pr-16" : ""}`}
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}
