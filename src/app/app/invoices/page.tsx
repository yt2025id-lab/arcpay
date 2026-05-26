"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { useInvoiceWrite, useIssuerInvoices, useRecipientInvoices } from "@/hooks/useInvoice";
import { useApproveUsdc, useUsdcAllowance } from "@/hooks/usePaymentLink";

export default function InvoicesPage() {
  const { address, isConnected } = useAccount();
  const { data: addresses } = useFactoryAddresses();
  const invoiceAddr = addresses?.[1] as `0x${string}` | undefined;
  const { data: issuedByMe } = useIssuerInvoices(invoiceAddr!, address!);
  const { data: issuedToMe } = useRecipientInvoices(invoiceAddr!, address!);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <p className="text-gray-500 text-lg">Connect your wallet to manage invoices</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black">Invoices</h1>
      <CreateInvoiceForm contractAddress={invoiceAddr!} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white neo-border-thick rounded-xl p-6">
          <h2 className="text-xl font-black mb-4 text-arc-blue">Issued By Me</h2>
          {issuedByMe && (issuedByMe as `0x${string}`[]).length > 0 ? (
            <div className="space-y-3">
              {(issuedByMe as `0x${string}`[]).map((id) => (
                <InvoiceRow key={id} invoiceId={id} contractAddress={invoiceAddr!} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No invoices issued yet.</p>
          )}
        </div>

        <div className="bg-white neo-border-thick rounded-xl p-6">
          <h2 className="text-xl font-black mb-4 text-arc-orange">Issued To Me</h2>
          {issuedToMe && (issuedToMe as `0x${string}`[]).length > 0 ? (
            <div className="space-y-3">
              {(issuedToMe as `0x${string}`[]).map((id) => (
                <InvoiceRow key={id} invoiceId={id} contractAddress={invoiceAddr!} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No invoices received yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateInvoiceForm({ contractAddress }: { contractAddress: `0x${string}` }) {
  const [recipient, setRecipient] = useState("");
  const [desc, setDesc] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [taxBps, setTaxBps] = useState("0");
  const [dueDate, setDueDate] = useState("");
  const [latePenaltyBps, setLatePenaltyBps] = useState("0");
  const { issueInvoice } = useInvoiceWrite(contractAddress);
  const { address } = useAccount();

  const handleSubmit = () => {
    if (!recipient || !unitPrice || !dueDate) return;
    const dueDateTs = BigInt(Math.floor(new Date(dueDate).getTime() / 1000));
    issueInvoice.write({
      recipient: recipient as `0x${string}`,
      items: [{
        description: desc,
        unitPrice: BigInt(Math.floor(parseFloat(unitPrice) * 1e6)),
        quantity: parseInt(quantity),
        taxBps: parseInt(taxBps),
      }],
      dueDate: dueDateTs,
      latePenaltyBps: parseInt(latePenaltyBps),
      privacyHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    });
  };

  return (
    <div className="bg-white neo-border-thick rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-black text-arc-blue">Issue Invoice</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold mb-1">Description</label>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Service fee"
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Unit Price (USDC)</label>
          <input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="500.00"
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">Tax (BPS, 100 = 1%)</label>
          <input
            type="number"
            value={taxBps}
            onChange={(e) => setTaxBps(e.target.value)}
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Late Penalty (BPS/day, max 500)</label>
          <input
            type="number"
            value={latePenaltyBps}
            onChange={(e) => setLatePenaltyBps(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 border-2 border-arc-black rounded-lg font-mono"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={issueInvoice.isPending || !recipient || !unitPrice}
        className="w-full bg-arc-blue text-white font-black py-4 rounded-lg neo-border-thick hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {issueInvoice.isPending ? "Confirming..." : "Issue Invoice"}
      </button>
    </div>
  );
}

function InvoiceRow({ invoiceId, contractAddress }: { invoiceId: `0x${string}`; contractAddress: `0x${string}` }) {
  const { invoiceData } = useInvoiceRead(contractAddress, invoiceId);
  const { payInvoice, cancelInvoice, disputeInvoice } = useInvoiceWrite(contractAddress);
  const { address } = useAccount();
  const [payAmount, setPayAmount] = useState("");

  const statusNames = ["Draft", "Issued", "Paid", "Partial", "Overdue", "Cancelled", "Disputed"];
  const statusColors: Record<number, string> = {
    0: "bg-gray-300", 1: "bg-arc-blue", 2: "bg-arc-green", 3: "bg-arc-lime",
    4: "bg-arc-orange", 5: "bg-red-500", 6: "bg-arc-purple",
  };

  if (!invoiceData?.data) return null;
  const d = invoiceData.data as any;
  const total = Number(d.totalAmount) / 1e6;
  const paid = Number(d.paidAmount) / 1e6;

  return (
    <div className="p-4 border-2 border-arc-black rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm">{invoiceId.slice(0, 18)}...</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusColors[d.status] || "bg-gray-200"}`}>
          {statusNames[d.status] || "Unknown"}
        </span>
      </div>
      <p className="font-black text-lg">{total.toFixed(2)} USDC</p>
      <p className="text-xs text-gray-500">Paid: {paid.toFixed(2)} / {total.toFixed(2)}</p>
      <p className="text-xs text-gray-500">
        Issuer: {d.issuer.slice(0, 6)}...{d.issuer.slice(-4)} → Recipient: {d.recipient.slice(0, 6)}...{d.recipient.slice(-4)}
      </p>
      <p className="text-xs text-gray-500">
        Due: {d.dueDate > 0n ? new Date(Number(d.dueDate) * 1000).toLocaleDateString() : "No due date"}
      </p>

      {d.status === 1 && d.recipient?.toLowerCase() === address?.toLowerCase() && (
        <div className="flex gap-2 pt-2">
          <input
            type="number"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            placeholder="Amount"
            className="flex-1 px-3 py-2 border-2 border-arc-black rounded-lg font-mono text-sm"
          />
          <button
            onClick={() => payInvoice.write(invoiceId, BigInt(Math.floor(parseFloat(payAmount || "0") * 1e6)))}
            disabled={payInvoice.isPending || !payAmount}
            className="px-4 py-2 bg-arc-green text-arc-black text-sm font-bold rounded-lg neo-border disabled:opacity-50"
          >
            Pay
          </button>
          <button
            onClick={() => disputeInvoice.write(invoiceId)}
            disabled={disputeInvoice.isPending}
            className="px-4 py-2 bg-arc-purple text-white text-sm font-bold rounded-lg neo-border disabled:opacity-50"
          >
            Dispute
          </button>
        </div>
      )}

      {d.status === 1 && d.issuer?.toLowerCase() === address?.toLowerCase() && (
        <button
          onClick={() => cancelInvoice.write(invoiceId)}
          disabled={cancelInvoice.isPending}
          className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg neo-border disabled:opacity-50"
        >
          Cancel
        </button>
      )}

      <a
        href={`/app/invoices/${invoiceId}`}
        className="block text-center px-4 py-2 bg-gray-100 text-arc-black text-sm font-bold rounded-lg hover:bg-gray-200"
      >
        View Details
      </a>
    </div>
  );
}

import { useInvoiceRead } from "@/hooks/useInvoice";
