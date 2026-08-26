// src/components/player/VideoDescription.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoDescriptionProps {
  description: string;
  viewCountText: string;
  publishedText: string;
}

export function VideoDescription({
  description,
  viewCountText,
  publishedText,
}: VideoDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded((v) => !v)}
      className="w-full rounded-xl bg-neutral-900 p-3 text-left transition-colors hover:bg-neutral-800/80"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-neutral-300">
          {viewCountText} · {publishedText}
        </p>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </div>
      <p
        className={cn(
          "mt-1.5 whitespace-pre-line text-sm text-neutral-200",
          !expanded && "line-clamp-2"
        )}
      >
        {description || "No description provided."}
      </p>
      {!expanded && (
        <span className="mt-1 inline-block text-xs font-medium text-neutral-400">
          Show more
        </span>
      )}
    </button>
  );
}
