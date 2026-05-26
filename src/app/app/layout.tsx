"use client";

import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-arc-white text-arc-black">
      <Sidebar />
      <main className="md:ml-64 p-6 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  );
}
