import { USDC_ADDRESS, FACTORY_ADDRESS } from "@/config/wagmi";
import { PaymentLinkABI } from "@/lib/abis/PaymentLink";
import { InvoiceABI } from "@/lib/abis/Invoice";
import { SplitRouterABI } from "@/lib/abis/SplitRouter";
import { EscrowVaultABI } from "@/lib/abis/EscrowVault";
import { ArcPayFactoryABI } from "@/lib/abis/ArcPayFactory";
import { FeeManagerABI } from "@/lib/abis/FeeManager";
import { ERC20ABI } from "@/lib/abis/ERC20";

export const USDC = {
  address: USDC_ADDRESS,
  abi: ERC20ABI,
} as const;

export const paymentLinkContract = (address: `0x${string}`) => ({
  address,
  abi: PaymentLinkABI,
} as const);

export const invoiceContract = (address: `0x${string}`) => ({
  address,
  abi: InvoiceABI,
} as const);

export const splitRouterContract = (address: `0x${string}`) => ({
  address,
  abi: SplitRouterABI,
} as const);

export const escrowVaultContract = (address: `0x${string}`) => ({
  address,
  abi: EscrowVaultABI,
} as const);

export const feeManagerContract = (address: `0x${string}`) => ({
  address,
  abi: FeeManagerABI,
} as const);

export const factoryContract = {
  address: FACTORY_ADDRESS,
  abi: ArcPayFactoryABI,
} as const;
