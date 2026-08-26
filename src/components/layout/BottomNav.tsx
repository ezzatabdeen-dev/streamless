// src/components/layout/BottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav-items";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-neutral-800 bg-neutral-950/95 backdrop-blur md:hidden",
        "pb-[env(safe-area-inset-bottom)]"
      )}
    >
      {navItems
        .filter((item) => item.mobile)
        .map((item) => {
          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-0.5 py-2.5"
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-white" : "text-neutral-500"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-[10px] transition-colors",
                  isActive ? "font-medium text-white" : "text-neutral-500"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
    </nav>
  );
}
