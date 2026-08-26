// src/components/layout/TopNav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Mic, ArrowLeft, PlayCircle, User } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";

export function TopNav() {
  const router = useRouter();
  const { toggleSidebar, mobileSearchOpen, setMobileSearchOpen } = useUIStore();
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/app/search?q=${encodeURIComponent(query.trim())}`);
    setMobileSearchOpen(false);
  };

  if (mobileSearchOpen) {
    return (
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-neutral-800 bg-neutral-950/95 px-3 backdrop-blur pt-[env(safe-area-inset-top)] md:hidden">
        <button
          onClick={() => setMobileSearchOpen(false)}
          className="shrink-0 rounded-full p-2 hover:bg-neutral-900"
          aria-label="Close search"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos"
            className="w-full rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-brand"
          />
        </form>
        <button
          type="button"
          className="shrink-0 rounded-full p-2 hover:bg-neutral-900"
          aria-label="Voice search"
        >
          <Mic className="h-5 w-5" />
        </button>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-neutral-800 bg-neutral-950/95 px-3 backdrop-blur pt-[env(safe-area-inset-top)] sm:px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="hidden rounded-full p-2 hover:bg-neutral-900 md:flex"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/app" className="flex items-center gap-1.5">
          <PlayCircle className="h-6 w-6 text-brand" />
          <span className="text-lg font-semibold tracking-tight">
            Streamless
          </span>
        </Link>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="hidden w-full max-w-md items-center md:flex"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full rounded-l-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-brand"
        />
        <button
          type="submit"
          className="rounded-r-full border border-l-0 border-neutral-700 bg-neutral-800 px-4 py-2 hover:bg-neutral-700"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="rounded-full p-2 hover:bg-neutral-900 md:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
        <Link
          href="/app/account"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700"
          )}
          aria-label="Account"
        >
          <User className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
