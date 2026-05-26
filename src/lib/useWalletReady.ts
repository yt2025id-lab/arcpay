"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return hydrated;
}

export function useWalletReady() {
  const { isConnected } = useAccount();
  const hydrated = useHydrated();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(timer);
  }, [hydrated]);

  return { isConnected, ready: ready && hydrated };
}
