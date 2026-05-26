"use client";

import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { arcChain } from "@/config/wagmi";
import { paymentLinkContract, USDC } from "@/config/contracts";
import { useQuery } from "@tanstack/react-query";

export function usePaymentLinkRead(contractAddress: `0x${string}`, linkId?: `0x${string}`) {
  const contract = paymentLinkContract(contractAddress);

  const linkData = useReadContract({
    ...contract,
    functionName: "links",
    args: linkId ? [linkId] : undefined,
    chainId: arcChain.id,
  });

  const linkCount = useReadContract({
    ...contract,
    functionName: "linkCount",
    chainId: arcChain.id,
  });

  return { linkData, linkCount };
}

export function useMerchantLinks(contractAddress: `0x${string}`, merchant: `0x${string}`) {
  const contract = paymentLinkContract(contractAddress);

  return useReadContract({
    ...contract,
    functionName: "getMerchantLinks",
    args: [merchant],
    chainId: arcChain.id,
  });
}

export function usePaymentLinkWrite(contractAddress: `0x${string}`) {
  const contract = paymentLinkContract(contractAddress);

  const createLink = useWriteContract();
  const pay = useWriteContract();
  const refund = useWriteContract();
  const cancelLink = useWriteContract();

  const createLinkReceipt = useWaitForTransactionReceipt({ hash: createLink.data });
  const payReceipt = useWaitForTransactionReceipt({ hash: pay.data });
  const refundReceipt = useWaitForTransactionReceipt({ hash: refund.data });
  const cancelReceipt = useWaitForTransactionReceipt({ hash: cancelLink.data });

  return {
    createLink: {
      write: (config: {
        merchant: `0x${string}`;
        amount: bigint;
        expiresAt: bigint;
        allowPartial: boolean;
        privacyHash: `0x${string}`;
        splitAddrs: `0x${string}`[];
        splitBps: number[];
      }) =>
        createLink.writeContract({
          ...contract,
          functionName: "createLink",
          args: [config],
          chainId: arcChain.id,
        }),
      ...createLink,
      receipt: createLinkReceipt,
    },
    pay: {
      write: (linkId: `0x${string}`, amount: bigint) =>
        pay.writeContract({
          ...contract,
          functionName: "pay",
          args: [linkId, amount],
          chainId: arcChain.id,
        }),
      ...pay,
      receipt: payReceipt,
    },
    refund: {
      write: (linkId: `0x${string}`) =>
        refund.writeContract({
          ...contract,
          functionName: "refund",
          args: [linkId],
          chainId: arcChain.id,
        }),
      ...refund,
      receipt: refundReceipt,
    },
    cancelLink: {
      write: (linkId: `0x${string}`) =>
        cancelLink.writeContract({
          ...contract,
          functionName: "cancelLink",
          args: [linkId],
          chainId: arcChain.id,
        }),
      ...cancelLink,
      receipt: cancelReceipt,
    },
  };
}

export function useUsdcAllowance(owner: `0x${string}`, spender: `0x${string}`) {
  return useReadContract({
    ...USDC,
    functionName: "allowance",
    args: [owner, spender],
    chainId: arcChain.id,
  });
}

export function useUsdcBalance(address: `0x${string}`) {
  return useReadContract({
    ...USDC,
    functionName: "balanceOf",
    args: [address],
    chainId: arcChain.id,
  });
}

export function useApproveUsdc() {
  const approve = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash: approve.data });

  return {
    write: (spender: `0x${string}`, amount: bigint) =>
      approve.writeContract({
        ...USDC,
        functionName: "approve",
        args: [spender, amount],
        chainId: arcChain.id,
      }),
    ...approve,
    receipt,
  };
}
