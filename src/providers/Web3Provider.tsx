"use client";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  injectedWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig } from "wagmi";
import { arcChain, transport } from "@/config/wagmi";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, walletConnectWallet, coinbaseWallet, injectedWallet],
    },
  ],
  {
    appName: "ArcPay",
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "arcpay-demo",
  }
);

export const config = createConfig({
  chains: [arcChain],
  transports: { [arcChain.id]: transport },
  connectors,
  ssr: true,
});

const queryClient = new QueryClient();

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#00D084",
            accentColorForeground: "white",
            borderRadius: "large",
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
