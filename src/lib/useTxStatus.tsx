"use client";

import { useEffect, useState } from "react";

type TxStatus = "idle" | "pending" | "success" | "error";

export function useTxStatus(writeHook: { isPending: boolean; error?: Error | null; receipt?: { status?: string } | undefined }) {
  const [status, setStatus] = useState<TxStatus>("idle");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (writeHook.isPending && status !== "pending") {
      setStatus("pending");
      setShowToast(true);
    } else if (writeHook.receipt?.status === "success" && status === "pending") {
      setStatus("success");
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(t);
    } else if (writeHook.error && status === "pending") {
      setStatus("error");
      setShowToast(true);
      const t = setTimeout(() => {
        setShowToast(false);
        setStatus("idle");
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [writeHook.isPending, writeHook.receipt, writeHook.error]);

  return { status, showToast, dismiss: () => setShowToast(false) };
}

export function TxToast({ status, message, onDismiss }: { status: TxStatus; message?: string; onDismiss: () => void }) {
  if (status === "idle") return null;

  const styles: Record<TxStatus, { bg: string; border: string; text: string; icon: string }> = {
    idle: { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-600", icon: "" },
    pending: { bg: "bg-arc-blue/10", border: "border-arc-blue", text: "text-arc-blue", icon: "⏳" },
    success: { bg: "bg-arc-green/10", border: "border-arc-green", text: "text-arc-green", icon: "✓" },
    error: { bg: "bg-red-50", border: "border-red-400", text: "text-red-600", icon: "✕" },
  };

  const s = styles[status];
  const labels: Record<TxStatus, string> = {
    idle: "",
    pending: "Transaction pending...",
    success: "Transaction confirmed!",
    error: "Transaction failed",
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[100] ${s.bg} border-2 ${s.border} rounded-xl px-5 py-4 neo-shadow-lg flex items-center gap-3 animate-slide-up max-w-sm`}>
      <span className="text-xl">{s.icon}</span>
      <div>
        <p className={`font-bold text-sm ${s.text}`}>{labels[status]}</p>
        {message && <p className="text-xs text-gray-500 mt-0.5">{message}</p>}
      </div>
      <button onClick={onDismiss} className="ml-2 text-gray-400 hover:text-gray-600">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
