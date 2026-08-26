// src/components/shared/ComingSoon.tsx
import { type LucideIcon, Construction } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

/**
 * Reusable placeholder for nav-linked sections that exist in the
 * Sidebar/BottomNav (Phase 3) but don't have real functionality built
 * out yet. Prevents 404s on every route referenced by the nav config,
 * while making it clear (rather than silently broken) that the section
 * is a planned feature.
 */
export function ComingSoon({
  title,
  description = "This section isn't built yet — check back in a future update.",
  icon: Icon = Construction,
}: ComingSoonProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <Icon className="h-8 w-8 text-neutral-600" />
      <h1 className="text-base font-semibold text-white">{title}</h1>
      <p className="max-w-sm text-sm text-neutral-400">{description}</p>
    </div>
  );
}
