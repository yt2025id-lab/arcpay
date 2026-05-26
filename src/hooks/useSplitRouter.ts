"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { arcChain } from "@/config/wagmi";
import { splitRouterContract } from "@/config/contracts";

export function useSplitRouterRead(contractAddress: `0x${string}`, splitId?: bigint) {
  const contract = splitRouterContract(contractAddress);

  const splitData = useReadContract({
    ...contract,
    functionName: "splits",
    args: splitId !== undefined ? [splitId] : undefined,
    chainId: arcChain.id,
  });

  const splitCount = useReadContract({
    ...contract,
    functionName: "splitCount",
    chainId: arcChain.id,
  });

  const recipients = useReadContract({
    ...contract,
    functionName: "getSplitRecipients",
    args: splitId !== undefined ? [splitId] : undefined,
    chainId: arcChain.id,
  });

  const bps = useReadContract({
    ...contract,
    functionName: "getSplitBps",
    args: splitId !== undefined ? [splitId] : undefined,
    chainId: arcChain.id,
  });

  return { splitData, splitCount, recipients, bps };
}

export function useUserSplits(contractAddress: `0x${string}`, user: `0x${string}`) {
  const contract = splitRouterContract(contractAddress);

  return useReadContract({
    ...contract,
    functionName: "getUserSplits",
    args: [user],
    chainId: arcChain.id,
  });
}

export function useSplitRouterWrite(contractAddress: `0x${string}`) {
  const contract = splitRouterContract(contractAddress);

  const createSplit = useWriteContract();
  const routePayment = useWriteContract();
  const updateSplit = useWriteContract();

  return {
    createSplit: {
      write: (recipients: `0x${string}`[], bps: number[], immutable_: boolean) =>
        createSplit.writeContract({
          ...contract,
          functionName: "createSplit",
          args: [recipients, bps, immutable_],
          chainId: arcChain.id,
        }),
      ...createSplit,
      receipt: useWaitForTransactionReceipt({ hash: createSplit.data }),
    },
    routePayment: {
      write: (splitId: bigint, amount: bigint) =>
        routePayment.writeContract({
          ...contract,
          functionName: "routePayment",
          args: [splitId, amount],
          chainId: arcChain.id,
        }),
      ...routePayment,
      receipt: useWaitForTransactionReceipt({ hash: routePayment.data }),
    },
    updateSplit: {
      write: (splitId: bigint, recipients: `0x${string}`[], bps: number[]) =>
        updateSplit.writeContract({
          ...contract,
          functionName: "updateSplit",
          args: [splitId, recipients, bps],
          chainId: arcChain.id,
        }),
      ...updateSplit,
      receipt: useWaitForTransactionReceipt({ hash: updateSplit.data }),
    },
  };
}
