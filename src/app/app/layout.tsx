"use client";

import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-arc-white text-arc-black">
      <Sidebar />
      <main className="md:ml-64 pt-14 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
