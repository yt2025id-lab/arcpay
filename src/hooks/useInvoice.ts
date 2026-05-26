"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { arcChain } from "@/config/wagmi";
import { invoiceContract } from "@/config/contracts";

export function useInvoiceRead(contractAddress: `0x${string}`, invoiceId?: `0x${string}`) {
  const contract = invoiceContract(contractAddress);

  const invoiceData = useReadContract({
    ...contract,
    functionName: "invoices",
    args: invoiceId ? [invoiceId] : undefined,
    chainId: arcChain.id,
  });

  const invoiceItems = useReadContract({
    ...contract,
    functionName: "getInvoiceItems",
    args: invoiceId ? [invoiceId] : undefined,
    chainId: arcChain.id,
  });

  const invoiceCount = useReadContract({
    ...contract,
    functionName: "invoiceCount",
    chainId: arcChain.id,
  });

  return { invoiceData, invoiceItems, invoiceCount };
}

export function useIssuerInvoices(contractAddress: `0x${string}`, issuer: `0x${string}`) {
  const contract = invoiceContract(contractAddress);

  return useReadContract({
    ...contract,
    functionName: "getIssuerInvoices",
    args: [issuer],
    chainId: arcChain.id,
  });
}

export function useRecipientInvoices(contractAddress: `0x${string}`, recipient: `0x${string}`) {
  const contract = invoiceContract(contractAddress);

  return useReadContract({
    ...contract,
    functionName: "getRecipientInvoices",
    args: [recipient],
    chainId: arcChain.id,
  });
}

export function useInvoiceWrite(contractAddress: `0x${string}`) {
  const contract = invoiceContract(contractAddress);

  const issue = useWriteContract();
  const pay = useWriteContract();
  const cancel = useWriteContract();
  const dispute = useWriteContract();

  return {
    issueInvoice: {
      write: (args: {
        recipient: `0x${string}`;
        items: { description: string; unitPrice: bigint; quantity: number; taxBps: number }[];
        dueDate: bigint;
        latePenaltyBps: number;
        privacyHash: `0x${string}`;
      }) =>
        issue.writeContract({
          ...contract,
          functionName: "issueInvoice",
          args: [args.recipient, args.items, args.dueDate, args.latePenaltyBps, args.privacyHash],
          chainId: arcChain.id,
        }),
      ...issue,
      receipt: useWaitForTransactionReceipt({ hash: issue.data }),
    },
    payInvoice: {
      write: (invoiceId: `0x${string}`, amount: bigint) =>
        pay.writeContract({
          ...contract,
          functionName: "payInvoice",
          args: [invoiceId, amount],
          chainId: arcChain.id,
        }),
      ...pay,
      receipt: useWaitForTransactionReceipt({ hash: pay.data }),
    },
    cancelInvoice: {
      write: (invoiceId: `0x${string}`) =>
        cancel.writeContract({
          ...contract,
          functionName: "cancelInvoice",
          args: [invoiceId],
          chainId: arcChain.id,
        }),
      ...cancel,
      receipt: useWaitForTransactionReceipt({ hash: cancel.data }),
    },
    disputeInvoice: {
      write: (invoiceId: `0x${string}`) =>
        dispute.writeContract({
          ...contract,
          functionName: "disputeInvoice",
          args: [invoiceId],
          chainId: arcChain.id,
        }),
      ...dispute,
      receipt: useWaitForTransactionReceipt({ hash: dispute.data }),
    },
  };
}
