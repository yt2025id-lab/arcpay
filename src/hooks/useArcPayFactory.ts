"use client";

import { useReadContract } from "wagmi";
import { arcChain } from "@/config/wagmi";
import { factoryContract } from "@/config/contracts";

export function useFactoryAddresses() {
  return useReadContract({
    ...factoryContract,
    functionName: "getProtocolAddresses",
    chainId: arcChain.id,
  });
}
