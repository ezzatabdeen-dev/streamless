// src/app/app/watch/page.tsx
import { getVideoDetail, InvidiousError } from "@/lib/invidious";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { VideoMeta } from "@/components/player/VideoMeta";
import { VideoDescription } from "@/components/player/VideoDescription";
import { RelatedVideos } from "@/components/player/RelatedVideos";
import { AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

interface WatchPageProps {
  searchParams: Promise<{ v?: string }>;
}

export async function generateMetadata({
  searchParams,
}: WatchPageProps): Promise<Metadata> {
  const { v } = await searchParams;
  if (!v) return { title: "Watch" };
  try {
    const video = await getVideoDetail(v);
    return { title: video.title };
  } catch {
    return { title: "Watch" };
  }
}

export default async function WatchPage({ searchParams }: WatchPageProps) {
  const { v: videoId } = await searchParams;

  if (!videoId) {
    return (
      <ErrorState message="No video ID provided. Go back and pick a video to watch." />
    );
  }

  try {
    const video = await getVideoDetail(videoId);

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
  } catch (err) {
    const message =
      err instanceof InvidiousError
        ? "Couldn't load this video — all backend instances failed to respond."
        : "Something went wrong loading this video.";
    return <ErrorState message={message} />;
  }
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <AlertTriangle className="h-8 w-8 text-brand" />
      <p className="max-w-sm text-sm text-neutral-400">{message}</p>
    </div>
  );
}
