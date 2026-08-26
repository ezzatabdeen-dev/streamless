// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Clock, ThumbsUp } from "lucide-react";
import { navItems } from "@/lib/nav-items";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";

const libraryShortcuts = [
  { label: "History", href: "/app/history", icon: History },
  { label: "Watch Later", href: "/app/watch-later", icon: Clock },
  { label: "Liked Videos", href: "/app/liked", icon: ThumbsUp },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useUIStore();

  return (
    <aside
      className={cn(
        "sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 overflow-y-auto border-r border-neutral-800 bg-neutral-950 py-3 transition-all duration-200 md:block",
        sidebarCollapsed ? "w-[72px]" : "w-60"
      )}
    >
      <nav className="flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-neutral-900",
                isActive && "bg-neutral-900 font-medium",
                sidebarCollapsed && "flex-col gap-1 py-3 text-center"
              )}
            >
              <Icon
                className={cn(
                  "shrink-0",
                  sidebarCollapsed ? "h-5 w-5" : "h-5 w-5",
                  isActive ? "text-white" : "text-neutral-400"
                )}
              />
              <span
                className={cn(
                  isActive ? "text-white" : "text-neutral-300",
                  sidebarCollapsed && "text-[10px]"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {!sidebarCollapsed && (
        <>
          <div className="mx-4 my-3 border-t border-neutral-800" />
          <p className="px-5 pb-1 text-xs font-medium text-neutral-500">
            Library
          </p>
          <nav className="flex flex-col gap-1 px-2">
            {libraryShortcuts.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-neutral-900",
                    isActive && "bg-neutral-900 font-medium"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-white" : "text-neutral-400"
                    )}
                  />
                  <span className={isActive ? "text-white" : "text-neutral-300"}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </aside>
  );
}
