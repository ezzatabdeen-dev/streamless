// src/app/app/layout.tsx
import type { Metadata } from "next";
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "Home",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-16 md:pb-0">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
