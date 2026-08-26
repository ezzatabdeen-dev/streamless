// src/lib/nav-items.ts
import { Home, Compass, Users, Library, Clapperboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  mobile?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/app", icon: Home, mobile: true },
  { label: "Shorts", href: "/app/shorts", icon: Clapperboard, mobile: true },
  { label: "Subscriptions", href: "/app/subscriptions", icon: Users, mobile: true },
  { label: "Library", href: "/app/library", icon: Library, mobile: true },
  { label: "Explore", href: "/app/explore", icon: Compass },
];
