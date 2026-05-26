"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { useInvoiceRead, useInvoiceWrite } from "@/hooks/useInvoice";
import { useApproveUsdc, useUsdcAllowance, useUsdcBalance } from "@/hooks/usePaymentLink";
import { formatAddress, formatUsdc } from "@/lib/utils";
import { useTxStatus, TxToast } from "@/lib/useTxStatus";

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as `0x${string}`;
  const { data: addresses } = useFactoryAddresses();
  const invoiceAddr = addresses?.[1] as `0x${string}` | undefined;
  if (!invoiceAddr) return <div className="p-8 text-gray-400 text-center">Loading...</div>;
  return <InvoiceDetail invoiceId={invoiceId} contractAddress={invoiceAddr} />;
}

function InvoiceDetail({ invoiceId, contractAddress }: { invoiceId: `0x${string}`; contractAddress: `0x${string}` }) {
  const { address, isConnected } = useAccount();
  const { invoiceData, invoiceItems } = useInvoiceRead(contractAddress, invoiceId);
  const { payInvoice, cancelInvoice, disputeInvoice } = useInvoiceWrite(contractAddress);
  const approve = useApproveUsdc();
  const { data: allowance } = useUsdcAllowance(address!, contractAddress);
  const { data: balance } = useUsdcBalance(address!);
  const [payAmount, setPayAmount] = useState("");
  const tx = useTxStatus(payInvoice);

  const statusConfig: Record<number, { label: string; bg: string; dot: string }> = {
    0: { label: "Draft", bg: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
    1: { label: "Issued", bg: "bg-arc-blue/10 text-arc-blue", dot: "bg-arc-blue" },
    2: { label: "Paid", bg: "bg-arc-green/10 text-arc-green", dot: "bg-arc-green" },
    3: { label: "Partial", bg: "bg-arc-lime/10 text-arc-lime", dot: "bg-arc-lime" },
    4: { label: "Overdue", bg: "bg-arc-orange/10 text-arc-orange", dot: "bg-arc-orange" },
    5: { label: "Cancelled", bg: "bg-red-50 text-red-500", dot: "bg-red-500" },
    6: { label: "Disputed", bg: "bg-arc-purple/10 text-arc-purple", dot: "bg-arc-purple" },
  };

  if (!invoiceData?.data) return <div className="p-8 text-gray-400 text-center">Loading invoice...</div>;
  const d = invoiceData.data as any;
  const total = Number(d.totalAmount) / 1e6;
  const paid = Number(d.paidAmount) / 1e6;
  const remaining = total - paid;
  const s = statusConfig[d.status] || statusConfig[0];

  const handlePay = async () => {
    if (!payAmount) return;
    const payRaw = BigInt(Math.floor(parseFloat(payAmount) * 1e6));
    const neededAllowance = allowance ? payRaw - (allowance as bigint) : payRaw;
    if (neededAllowance > 0n) {
      await approve.write(contractAddress, payRaw * 2n);
      await new Promise((r) => setTimeout(r, 3000));
    }
    payInvoice.write(invoiceId, payRaw);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <a href="/app/invoices" className="text-sm font-bold text-gray-400 hover:text-arc-blue transition-colors inline-flex items-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        Invoices
      </a>

      <div className="bg-white neo-border-thick rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold ${s.bg}`}>
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />{s.label}
          </span>
          <h1 className="text-5xl font-black mt-5 font-mono">{formatUsdc(d.totalAmount)}</h1>
          <p className="text-gray-400 font-bold mt-1">USDC</p>
        </div>

        <div className="space-y-0 text-sm">
          <Row label="Issuer" value={formatAddress(d.issuer)} />
          <Row label="Recipient" value={formatAddress(d.recipient)} />
          <Row label="Total" value={`${total.toFixed(2)} USDC`} />
          <Row label="Paid" value={`${paid.toFixed(2)} USDC`} />
          {remaining > 0 && <Row label="Remaining" value={`${remaining.toFixed(2)} USDC`} />}
          {d.dueDate > 0n && <Row label="Due Date" value={new Date(Number(d.dueDate) * 1000).toLocaleDateString()} />}
          {d.latePenaltyBps > 0 && <Row label="Late Penalty" value={`${d.latePenaltyBps} BPS/day`} />}
        </div>

        {invoiceItems?.data && (invoiceItems.data as any[]).length > 0 && (
          <div className="border-t-2 border-gray-100 pt-4">
            <h3 className="font-black mb-3 text-sm">Line Items</h3>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-400 text-xs uppercase"><th className="pb-2">Description</th><th className="pb-2 text-right">Price</th><th className="pb-2 text-right">Qty</th><th className="pb-2 text-right">Tax</th></tr></thead>
              <tbody>
                {(invoiceItems.data as any[]).map((item, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="py-2 font-bold">{item.description}</td>
                    <td className="py-2 text-right font-mono">{(Number(item.unitPrice) / 1e6).toFixed(2)}</td>
                    <td className="py-2 text-right">{item.quantity}</td>
                    <td className="py-2 text-right">{item.taxBps / 100}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(d.status === 1 || d.status === 3) && isConnected && d.recipient?.toLowerCase() === address?.toLowerCase() && (
          <div className="space-y-4 pt-4 border-t-2 border-gray-100">
            <h3 className="font-black text-base">Pay This Invoice</h3>
            <div className="relative">
              <input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder={remaining.toFixed(2)}
                className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono text-lg bg-white focus:outline-none focus:ring-2 focus:ring-arc-green/30 pr-16" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">USDC</span>
            </div>
            {balance !== undefined && <p className="text-xs text-gray-400">Balance: {formatUsdc(balance)} USDC</p>}
            <div className="flex gap-3">
              <button onClick={handlePay} disabled={payInvoice.isPending || approve.isPending || !payAmount}
                className="flex-1 bg-arc-green text-arc-black font-black py-3.5 rounded-lg neo-border-thick hover:-translate-y-0.5 transition-transform disabled:opacity-50">
                {payInvoice.isPending || approve.isPending ? "Confirming..." : "Pay Invoice"}
              </button>
              <button onClick={() => disputeInvoice.write(invoiceId)} disabled={disputeInvoice.isPending}
                className="px-6 py-3.5 bg-arc-purple/10 text-arc-purple font-bold rounded-lg border-2 border-arc-purple/30 hover:border-arc-purple disabled:opacity-50">Dispute</button>
            </div>
          </div>
        )}

        {d.status === 1 && isConnected && d.issuer?.toLowerCase() === address?.toLowerCase() && (
          <div className="pt-4 border-t-2 border-gray-100">
            <button onClick={() => cancelInvoice.write(invoiceId)} disabled={cancelInvoice.isPending}
              className="w-full bg-red-50 text-red-500 font-bold py-3 rounded-lg border-2 border-red-200 hover:border-red-400 disabled:opacity-50">Cancel Invoice</button>
          </div>
        )}

        {!isConnected && (d.status === 1 || d.status === 3) && (
          <div className="text-center pt-4 border-t-2 border-gray-100">
            <p className="text-gray-400 mb-4 text-sm">Connect wallet to pay this invoice</p>
            <ConnectButton />
          </div>
        )}
      </div>

      <TxToast status={tx.status} onDismiss={tx.dismiss} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="font-bold text-gray-400 text-xs uppercase tracking-wider">{label}</span>
      <span className="font-mono font-bold">{value}</span>
    </div>
  );
}
