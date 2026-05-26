"use client";

import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { useInvoiceRead, useInvoiceWrite } from "@/hooks/useInvoice";
import { useApproveUsdc, useUsdcAllowance, useUsdcBalance } from "@/hooks/usePaymentLink";
import { useState } from "react";

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as `0x${string}`;
  const { data: addresses } = useFactoryAddresses();
  const invoiceAddr = addresses?.[1] as `0x${string}` | undefined;

  if (!invoiceAddr) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

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

  const statusNames = ["Draft", "Issued", "Paid", "Partial", "Overdue", "Cancelled", "Disputed"];
  const statusColors: Record<number, string> = {
    0: "bg-gray-300", 1: "bg-arc-blue", 2: "bg-arc-green", 3: "bg-arc-lime",
    4: "bg-arc-orange", 5: "bg-red-500", 6: "bg-arc-purple",
  };

  if (!invoiceData?.data) {
    return <div className="p-8 text-gray-500">Loading invoice...</div>;
  }

  const d = invoiceData.data as any;
  const total = Number(d.totalAmount) / 1e6;
  const paid = Number(d.paidAmount) / 1e6;
  const remaining = total - paid;

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
    <div className="max-w-2xl mx-auto space-y-6">
      <a href="/app/invoices" className="text-sm font-bold text-gray-500 hover:text-arc-blue">← Back to Invoices</a>

      <div className="bg-white neo-border-thick rounded-xl p-8 space-y-6">
        <div className="text-center">
          <span className={`inline-block px-4 py-1 rounded-full text-white text-sm font-bold ${statusColors[d.status] || "bg-gray-200"}`}>
            {statusNames[d.status]}
          </span>
          <h1 className="text-4xl font-black mt-4">Invoice</h1>
          <p className="font-mono text-sm text-gray-400 mt-2">{invoiceId}</p>
        </div>

        <div className="space-y-3 text-sm">
          <Row label="Issuer" value={`${d.issuer.slice(0, 6)}...${d.issuer.slice(-4)}`} />
          <Row label="Recipient" value={`${d.recipient.slice(0, 6)}...${d.recipient.slice(-4)}`} />
          <Row label="Total" value={`${total.toFixed(2)} USDC`} />
          <Row label="Paid" value={`${paid.toFixed(2)} USDC`} />
          <Row label="Remaining" value={`${remaining.toFixed(2)} USDC`} />
          {d.dueDate > 0n && <Row label="Due Date" value={new Date(Number(d.dueDate) * 1000).toLocaleDateString()} />}
          {d.latePenaltyBps > 0 && <Row label="Late Penalty" value={`${d.latePenaltyBps} BPS/day`} />}
        </div>

        {invoiceItems?.data && (invoiceItems.data as any[]).length > 0 && (
          <div className="border-t-2 border-gray-100 pt-4">
            <h3 className="font-black mb-3">Line Items</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-right">Unit Price</th>
                  <th className="pb-2 text-right">Qty</th>
                  <th className="pb-2 text-right">Tax</th>
                </tr>
              </thead>
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
            <h3 className="font-black text-lg">Pay This Invoice</h3>
            <div>
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder={remaining.toFixed(2)}
                className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono text-lg"
              />
              {balance !== undefined && (
                <p className="text-xs text-gray-500 mt-1">Balance: {(Number(balance) / 1e6).toFixed(2)} USDC</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePay}
                disabled={payInvoice.isPending || approve.isPending || !payAmount}
                className="flex-1 bg-arc-green text-arc-black font-black py-4 rounded-lg neo-border-thick hover:-translate-y-0.5 transition-transform disabled:opacity-50"
              >
                {payInvoice.isPending || approve.isPending ? "Confirming..." : "Pay Invoice"}
              </button>
              <button
                onClick={() => disputeInvoice.write(invoiceId)}
                disabled={disputeInvoice.isPending}
                className="px-6 py-4 bg-arc-purple text-white font-bold rounded-lg neo-border disabled:opacity-50"
              >
                Dispute
              </button>
            </div>
          </div>
        )}

        {(d.status === 1) && isConnected && d.issuer?.toLowerCase() === address?.toLowerCase() && (
          <div className="pt-4 border-t-2 border-gray-100">
            <button
              onClick={() => cancelInvoice.write(invoiceId)}
              disabled={cancelInvoice.isPending}
              className="w-full bg-red-500 text-white font-bold py-3 rounded-lg neo-border disabled:opacity-50"
            >
              Cancel Invoice
            </button>
          </div>
        )}

        {!isConnected && (d.status === 1 || d.status === 3) && (
          <div className="text-center pt-4 border-t-2 border-gray-100">
            <p className="text-gray-500 mb-4">Connect wallet to pay this invoice</p>
            <ConnectButton />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="font-bold text-gray-500">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}
