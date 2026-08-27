// src/app/app/page.tsx
"use client";
// Converted to a Client Component: the Invidious fetch now happens in
// the browser (see architecture note in src/lib/invidious/instances.ts),
// so this page can no longer be an async Server Component that awaits
// data directly. It manages its own loading/error/success state via
// useAsyncData instead.

import { getPopular, InvidiousError } from "@/lib/invidious";
import { VideoCard } from "@/components/VideoCard";
import { VideoGridSkeleton } from "@/components/VideoGridSkeleton";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AlertTriangle } from "lucide-react";

export default function AppHomePage() {
  const state = useAsyncData(() => getPopular(), []);

  if (state.status === "loading") {
    return <VideoGridSkeleton />;
  }

  if (state.status === "error") {
    const message =
      state.error instanceof InvidiousError
        ? `Couldn't reach any video backend (tried ${state.error.instancesTried.length} instance(s)).`
        : "Something went wrong loading the home feed.";
    return <EmptyState message={message} isError />;
  }

  const videos = state.data;

  if (!videos || videos.length === 0) {
    return <EmptyState message="No trending videos available right now." />;
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.videoId} video={video} />
      ))}
    </div>
  );
}

function EmptyState({
  message,
  isError,
}: {
  message: string;
  isError?: boolean;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <AlertTriangle
        className={`h-8 w-8 ${isError ? "text-brand" : "text-neutral-600"}`}
      />
      <p className="max-w-sm text-sm text-neutral-400">{message}</p>
    </div>
  );
}
