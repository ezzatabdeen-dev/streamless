// src/components/InstallButton.tsx
"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { IosInstallSheet } from "./IosInstallSheet";
import { cn } from "@/lib/utils";

export function InstallButton({ className }: { className?: string }) {
  const { state, promptInstall } = useInstallPrompt();
  const [iosSheetOpen, setIosSheetOpen] = useState(false);

  if (state === "installed") {
    return (
      <button
        disabled
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl bg-neutral-800 px-6 py-3.5 text-sm font-semibold text-neutral-400",
          className
        )}
      >
        <Check className="h-4 w-4" />
        App Installed
      </button>
    );
  }

  const handleClick = () => {
    if (state === "ios-manual") {
      setIosSheetOpen(true);
      return;
    }
    if (state === "installable") {
      promptInstall();
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={state === "unsupported"}
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <Download className="h-4 w-4" />
        {state === "unsupported" ? "Open in Chrome to Install" : "Install App"}
      </button>
      <IosInstallSheet open={iosSheetOpen} onClose={() => setIosSheetOpen(false)} />
    </>
  );
}
