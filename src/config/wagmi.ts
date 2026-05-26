import { defineChain } from "viem";
import { http } from "wagmi";

export const arcChain = defineChain({
  id: 4200,
  name: "Arc Blockchain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.arcblockchain.com"] },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: "https://explorer.arcblockchain.com" },
  },
});

export const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const FACTORY_ADDRESS = (process.env.NEXT_PUBLIC_FACTORY_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.arcblockchain.com";

export const transport = http(RPC_URL);
