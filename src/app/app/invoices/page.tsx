"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFactoryAddresses } from "@/hooks/useArcPayFactory";
import { useInvoiceRead, useInvoiceWrite, useIssuerInvoices, useRecipientInvoices } from "@/hooks/useInvoice";
import { useApproveUsdc, useUsdcAllowance } from "@/hooks/usePaymentLink";
import { formatAddress, formatUsdc } from "@/lib/utils";
import { useTxStatus, TxToast } from "@/lib/useTxStatus";
import { useWalletReady } from "@/lib/useWalletReady";

export default function InvoicesPage() {
  const { address, isConnected } = useAccount();
  const { ready } = useWalletReady();
  const { data: addresses } = useFactoryAddresses();
  const invoiceAddr = addresses?.[1] as `0x${string}` | undefined;
  const { data: issuedByMe } = useIssuerInvoices(invoiceAddr!, address!);
  const { data: issuedToMe } = useRecipientInvoices(invoiceAddr!, address!);

  if (!ready) {
    return <div className="flex items-center justify-center min-h-[80vh]"><div className="w-8 h-8 border-3 border-arc-green border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <p className="text-gray-500 text-lg">Connect your wallet to manage invoices</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <h1 className="text-3xl font-black">Invoices</h1>
      <CreateInvoiceForm contractAddress={invoiceAddr!} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white neo-border-thick rounded-xl p-6">
          <h2 className="text-lg font-black mb-4 text-arc-blue flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
            Issued By Me
          </h2>
          {issuedByMe && (issuedByMe as `0x${string}`[]).length > 0 ? (
            <div className="space-y-3">
              {(issuedByMe as `0x${string}`[]).map((id) => <InvoiceRow key={id} invoiceId={id} contractAddress={invoiceAddr!} />)}
            </div>
          ) : (
            <EmptyState message="No invoices issued yet" />
          )}
        </div>
        <div className="bg-white neo-border-thick rounded-xl p-6">
          <h2 className="text-lg font-black mb-4 text-arc-orange flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
            Issued To Me
          </h2>
          {issuedToMe && (issuedToMe as `0x${string}`[]).length > 0 ? (
            <div className="space-y-3">
              {(issuedToMe as `0x${string}`[]).map((id) => <InvoiceRow key={id} invoiceId={id} contractAddress={invoiceAddr!} />)}
            </div>
          ) : (
            <EmptyState message="No invoices received yet" />
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
  const tx = useTxStatus(issueInvoice);

  const handleSubmit = () => {
    if (!recipient || !unitPrice || !dueDate) return;
    issueInvoice.write({
      recipient: recipient as `0x${string}`,
      items: [{ description: desc, unitPrice: BigInt(Math.floor(parseFloat(unitPrice) * 1e6)), quantity: parseInt(quantity), taxBps: parseInt(taxBps) }],
      dueDate: BigInt(Math.floor(new Date(dueDate).getTime() / 1000)),
      latePenaltyBps: parseInt(latePenaltyBps),
      privacyHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    });
  };

  return (
    <div className="bg-white neo-border-thick rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-black text-arc-blue flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Issue Invoice
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Recipient" value={recipient} onChange={setRecipient} placeholder="0x..." mono />
        <InputField label="Due Date" type="date" value={dueDate} onChange={setDueDate} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2"><InputField label="Description" value={desc} onChange={setDesc} placeholder="Service fee" /></div>
        <InputField label="Unit Price" suffix="USDC" type="number" value={unitPrice} onChange={setUnitPrice} placeholder="500.00" />
        <InputField label="Quantity" type="number" value={quantity} onChange={setQuantity} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Tax (BPS, 100=1%)" type="number" value={taxBps} onChange={setTaxBps} placeholder="0" />
        <InputField label="Late Penalty BPS/day" type="number" value={latePenaltyBps} onChange={setLatePenaltyBps} placeholder="0" />
      </div>
      <button onClick={handleSubmit} disabled={issueInvoice.isPending || !recipient || !unitPrice} className="w-full bg-arc-blue text-white font-black py-3.5 rounded-lg neo-border-thick hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-base">
        {issueInvoice.isPending ? "Confirm in wallet..." : "Issue Invoice"}
      </button>
      <TxToast status={tx.status} onDismiss={tx.dismiss} />
    </div>
  );
}

function InvoiceRow({ invoiceId, contractAddress }: { invoiceId: `0x${string}`; contractAddress: `0x${string}` }) {
  const { invoiceData } = useInvoiceRead(contractAddress, invoiceId);
  const { payInvoice, cancelInvoice, disputeInvoice } = useInvoiceWrite(contractAddress);
  const { address } = useAccount();
  const [payAmount, setPayAmount] = useState("");

  const statusConfig: Record<number, { label: string; bg: string; dot: string }> = {
    0: { label: "Draft", bg: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
    1: { label: "Issued", bg: "bg-arc-blue/10 text-arc-blue", dot: "bg-arc-blue" },
    2: { label: "Paid", bg: "bg-arc-green/10 text-arc-green", dot: "bg-arc-green" },
    3: { label: "Partial", bg: "bg-arc-lime/10 text-arc-lime", dot: "bg-arc-lime" },
    4: { label: "Overdue", bg: "bg-arc-orange/10 text-arc-orange", dot: "bg-arc-orange" },
    5: { label: "Cancelled", bg: "bg-red-50 text-red-500", dot: "bg-red-500" },
    6: { label: "Disputed", bg: "bg-arc-purple/10 text-arc-purple", dot: "bg-arc-purple" },
  };

  if (!invoiceData?.data) return <div className="h-20 bg-gray-50 rounded-lg animate-shimmer" />;
  const d = invoiceData.data as any;
  const s = statusConfig[d.status] || statusConfig[0];
  const total = Number(d.totalAmount) / 1e6;
  const paid = Number(d.paidAmount) / 1e6;

  return (
    <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-arc-black/30 transition-colors space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-gray-400 truncate">{invoiceId.slice(0, 20)}...</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${s.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
        </span>
      </div>
      <p className="font-black text-lg">{formatUsdc(d.totalAmount)} <span className="text-sm text-gray-400 font-normal">USDC</span></p>
      <p className="text-xs text-gray-400">{formatAddress(d.issuer)} → {formatAddress(d.recipient)}</p>
      {paid > 0 && <p className="text-xs text-gray-400">Paid: {paid.toFixed(2)} / {total.toFixed(2)}</p>}

      {d.status === 1 && d.recipient?.toLowerCase() === address?.toLowerCase() && (
        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="Amount"
            className="flex-1 px-3 py-2 border-2 border-arc-black rounded-lg font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-arc-green/30" />
          <button onClick={() => payInvoice.write(invoiceId, BigInt(Math.floor(parseFloat(payAmount || "0") * 1e6)))} disabled={payInvoice.isPending || !payAmount}
            className="px-4 py-2 bg-arc-green text-arc-black text-xs font-bold rounded-lg border-2 border-arc-green hover:bg-arc-green/80 disabled:opacity-50">Pay</button>
          <button onClick={() => disputeInvoice.write(invoiceId)} disabled={disputeInvoice.isPending}
            className="px-4 py-2 bg-arc-purple/10 text-arc-purple text-xs font-bold rounded-lg border-2 border-arc-purple/30 hover:border-arc-purple disabled:opacity-50">Dispute</button>
        </div>
      )}

      {d.status === 1 && d.issuer?.toLowerCase() === address?.toLowerCase() && (
        <button onClick={() => cancelInvoice.write(invoiceId)} disabled={cancelInvoice.isPending}
          className="px-4 py-2 bg-red-50 text-red-500 text-xs font-bold rounded-lg border-2 border-red-200 hover:border-red-400 disabled:opacity-50">Cancel</button>
      )}

      <a href={`/app/invoices/${invoiceId}`} className="block text-center text-sm font-bold text-arc-blue hover:underline">View Details</a>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-3 flex items-center justify-center text-gray-300">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
      </div>
      <p className="font-bold text-gray-400 text-sm">{message}</p>
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
          className={`w-full px-4 py-3 border-2 border-arc-black rounded-lg ${mono ? "font-mono text-sm" : "font-bold"} bg-white focus:outline-none focus:ring-2 focus:ring-arc-blue/30 ${suffix ? "pr-16" : ""}`}
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}
