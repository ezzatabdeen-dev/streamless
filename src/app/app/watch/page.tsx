// src/app/app/watch/page.tsx
"use client";
// Converted to a Client Component. Key differences from the original
// server-side version:
//  1. `searchParams` prop → `useSearchParams()` client hook.
//  2. getVideoDetail() runs via useAsyncData instead of being awaited
//     directly.
//  3. `generateMetadata` is gone — that Next.js API only works in Server
//     Components. We set document.title manually via useEffect once the
//     video data arrives instead (a reasonable trade-off; the tab title
//     briefly shows the app default before updating).
//  4. Wrapped in <Suspense> because useSearchParams() requires it — see
//     the same note in src/app/app/search/page.tsx.

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getVideoDetail, InvidiousError } from "@/lib/invidious";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { VideoMeta } from "@/components/player/VideoMeta";
import { VideoDescription } from "@/components/player/VideoDescription";
import { RelatedVideos } from "@/components/player/RelatedVideos";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AlertTriangle } from "lucide-react";

export default function WatchPage() {
  return (
    <Suspense fallback={<WatchSkeleton />}>
      <WatchPageInner />
    </Suspense>
  );
}

function WatchPageInner() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v");

  const state = useAsyncData(
    () => (videoId ? getVideoDetail(videoId) : Promise.reject(new Error("no id"))),
    [videoId]
  );

  useEffect(() => {
    if (state.status === "success") {
      document.title = state.data.title;
    }
  }, [state]);

  if (!videoId) {
    return (
      <ErrorState message="No video ID provided. Go back and pick a video to watch." />
    );
  }

  if (state.status === "loading") {
    return <WatchSkeleton />;
  }

  if (state.status === "error") {
    const message =
      state.error instanceof InvidiousError
        ? "Couldn't load this video — all backend instances failed to respond."
        : "Something went wrong loading this video.";
    return <ErrorState message={message} />;
  }

  const video = state.data;

  if (!video.hlsUrl) {
    return (
      <ErrorState message="This video doesn't have an HLS stream available on the current instance. Try again shortly — a different instance may support it." />
    );
  }

  const thumbnail =
    video.videoThumbnails?.find((t) => t.quality === "medium")?.url;

  return (
    <div className="flex flex-col gap-4 pb-6 lg:flex-row lg:gap-6 lg:p-4">
      <div className="min-w-0 flex-1">
        <VideoPlayer
          hlsUrl={video.hlsUrl}
          title={video.title}
          author={video.author}
          thumbnail={thumbnail}
        />

        <VideoMeta
          title={video.title}
          author={video.author}
          authorThumbnail={video.authorThumbnails?.[0]?.url}
          subCountText={video.subCountText}
          likeCount={video.likeCount}
        />

        <div className="mt-3 px-3">
          <VideoDescription
            description={video.description}
            viewCountText={video.viewCountText ?? `${video.viewCount} views`}
            publishedText={video.publishedText}
          />
        </div>

        <div className="mt-4 lg:hidden">
          <h2 className="mb-2 px-3 text-sm font-semibold text-white">
            Up next
          </h2>
          <RelatedVideos videos={video.recommendedVideos ?? []} />
        </div>
      </div>

      <aside className="hidden w-[380px] shrink-0 lg:block">
        <h2 className="mb-2 text-sm font-semibold text-white">Up next</h2>
        <RelatedVideos videos={video.recommendedVideos ?? []} />
      </aside>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <AlertTriangle className="h-8 w-8 text-brand" />
      <p className="max-w-sm text-sm text-neutral-400">{message}</p>
    </div>
  );
}

function RelatedVideoSkeleton() {
  return (
    <div className="flex gap-2 p-1.5">
      <div className="h-[70px] w-[124px] shrink-0 rounded-lg bg-neutral-900" />
      <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
        <div className="h-3.5 w-full rounded bg-neutral-900" />
        <div className="h-3.5 w-3/4 rounded bg-neutral-900" />
        <div className="h-3 w-1/3 rounded bg-neutral-900" />
      </div>
    </div>
  );
}

function WatchSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 pb-6 lg:flex-row lg:gap-6 lg:p-4">
      <div className="min-w-0 flex-1">
        <div className="aspect-video w-full bg-neutral-900" />
        <div className="px-3 pt-3">
          <div className="h-4 w-full rounded bg-neutral-900" />
          <div className="mt-2 h-4 w-2/3 rounded bg-neutral-900" />
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 shrink-0 rounded-full bg-neutral-900" />
              <div className="space-y-1.5">
                <div className="h-3 w-24 rounded bg-neutral-900" />
                <div className="h-2.5 w-16 rounded bg-neutral-900" />
              </div>
            </div>
            <div className="flex gap-1.5">
              <div className="h-8 w-16 rounded-full bg-neutral-900" />
              <div className="h-8 w-8 rounded-full bg-neutral-900" />
              <div className="h-8 w-8 rounded-full bg-neutral-900" />
            </div>
          </div>
        </div>
        <div className="mx-3 mt-3 h-20 rounded-xl bg-neutral-900" />
        <div className="mt-4 lg:hidden">
          <div className="mx-3 mb-2 h-3.5 w-16 rounded bg-neutral-900" />
          <div className="flex flex-col gap-1 px-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <RelatedVideoSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
      <aside className="hidden w-[380px] shrink-0 lg:block">
        <div className="mb-2 h-3.5 w-16 rounded bg-neutral-900" />
        <div className="flex flex-col gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <RelatedVideoSkeleton key={i} />
          ))}
        </div>
      </aside>
    </div>
  );
}
