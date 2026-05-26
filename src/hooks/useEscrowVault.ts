"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { arcChain } from "@/config/wagmi";
import { escrowVaultContract } from "@/config/contracts";

export function useEscrowRead(contractAddress: `0x${string}`, escrowId?: `0x${string}`) {
  const contract = escrowVaultContract(contractAddress);

  const escrowData = useReadContract({
    ...contract,
    functionName: "escrows",
    args: escrowId ? [escrowId] : undefined,
    chainId: arcChain.id,
  });

  const escrowCount = useReadContract({
    ...contract,
    functionName: "escrowCount",
    chainId: arcChain.id,
  });

  return { escrowData, escrowCount };
}

export function useUserEscrows(contractAddress: `0x${string}`, user: `0x${string}`) {
  const contract = escrowVaultContract(contractAddress);

  return useReadContract({
    ...contract,
    functionName: "getUserEscrows",
    args: [user],
    chainId: arcChain.id,
  });
}

export function useEscrowWrite(contractAddress: `0x${string}`) {
  const contract = escrowVaultContract(contractAddress);

  const create = useWriteContract();
  const fund = useWriteContract();
  const release = useWriteContract();
  const refund = useWriteContract();
  const dispute = useWriteContract();

  return {
    createEscrow: {
      write: (seller: `0x${string}`, amount: bigint, releaseAt: bigint, arbiter: `0x${string}`) =>
        create.writeContract({
          ...contract,
          functionName: "createEscrow",
          args: [seller, amount, releaseAt, arbiter],
          chainId: arcChain.id,
        }),
      ...create,
      receipt: useWaitForTransactionReceipt({ hash: create.data }),
    },
    fundEscrow: {
      write: (escrowId: `0x${string}`) =>
        fund.writeContract({
          ...contract,
          functionName: "fundEscrow",
          args: [escrowId],
          chainId: arcChain.id,
        }),
      ...fund,
      receipt: useWaitForTransactionReceipt({ hash: fund.data }),
    },
    release: {
      write: (escrowId: `0x${string}`) =>
        release.writeContract({
          ...contract,
          functionName: "release",
          args: [escrowId],
          chainId: arcChain.id,
        }),
      ...release,
      receipt: useWaitForTransactionReceipt({ hash: release.data }),
    },
    refund: {
      write: (escrowId: `0x${string}`) =>
        refund.writeContract({
          ...contract,
          functionName: "refund",
          args: [escrowId],
          chainId: arcChain.id,
        }),
      ...refund,
      receipt: useWaitForTransactionReceipt({ hash: refund.data }),
    },
    dispute: {
      write: (escrowId: `0x${string}`) =>
        dispute.writeContract({
          ...contract,
          functionName: "dispute",
          args: [escrowId],
          chainId: arcChain.id,
        }),
      ...dispute,
      receipt: useWaitForTransactionReceipt({ hash: dispute.data }),
    },
  };
}
