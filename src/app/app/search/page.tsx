// src/app/app/search/page.tsx
"use client";
// Converted to a Client Component. Two changes from the original
// server-side version:
//  1. `searchParams` prop → `useSearchParams()` client hook (Next.js
//     only passes `searchParams` as a prop to Server Components).
//  2. The Invidious search call now runs via useAsyncData instead of
//     being awaited directly in the component body.

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchVideos, InvidiousError } from "@/lib/invidious";
import type { InvidiousVideo } from "@/lib/invidious";
import { VideoCard } from "@/components/VideoCard";
import { VideoGridSkeleton } from "@/components/VideoGridSkeleton";
import { useAsyncData } from "@/hooks/useAsyncData";
import { SearchX, AlertTriangle } from "lucide-react";

// Next.js requires any component calling useSearchParams() to be wrapped
// in a Suspense boundary (otherwise the build fails with "useSearchParams
// should be wrapped in a suspense boundary") — the actual query-reading
// logic lives in SearchPageInner below, and this outer component just
// provides that boundary with our skeleton as the fallback.
export default function SearchPage() {
  return (
    <Suspense fallback={<VideoGridSkeleton count={8} />}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const state = useAsyncData(
    () => (query ? searchVideos(query, { type: "video" }) : Promise.resolve([])),
    [query]
  );

  if (!query) {
    return (
      <StatusMessage icon={SearchX} message="Type something to search for." />
    );
  }

  if (state.status === "loading") {
    return <VideoGridSkeleton count={8} />;
  }

  if (state.status === "error") {
    const message =
      state.error instanceof InvidiousError
        ? "Search backend is temporarily unreachable. Try again shortly."
        : "Something went wrong while searching.";
    return <StatusMessage icon={AlertTriangle} message={message} isError />;
  }

  const videos = state.data.filter(
    (item): item is InvidiousVideo => item.type === "video"
  );

  if (videos.length === 0) {
    return (
      <StatusMessage
        icon={SearchX}
        message={`No results found for "${query}".`}
      />
    );
  }

  return (
    <div className="p-4">
      <p className="mb-4 text-sm text-neutral-400">
        Results for <span className="text-white">&quot;{query}&quot;</span>
      </p>
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
      </div>
    </div>
  );
}

function StatusMessage({
  icon: Icon,
  message,
  isError,
}: {
  icon: typeof SearchX;
  message: string;
  isError?: boolean;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <Icon className={`h-8 w-8 ${isError ? "text-brand" : "text-neutral-600"}`} />
      <p className="max-w-sm text-sm text-neutral-400">{message}</p>
    </div>
  );
}
