// src/components/IosInstallSheet.tsx
"use client";

import { Share, PlusSquare, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function IosInstallSheet({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl bg-neutral-900 p-6 pb-8 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Install on iOS</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-neutral-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ol className="space-y-4 text-sm text-neutral-300">
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800">
              <Share className="h-4 w-4" />
            </span>
            Tap the <strong className="text-white">Share</strong> button in
            Safari&apos;s toolbar
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800">
              <PlusSquare className="h-4 w-4" />
            </span>
            Scroll down and tap{" "}
            <strong className="text-white">Add to Home Screen</strong>
          </li>
        </ol>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-brand py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
