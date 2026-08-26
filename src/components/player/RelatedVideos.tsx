// src/components/player/RelatedVideos.tsx
import Link from "next/link";
import type { InvidiousVideo } from "@/lib/invidious";

function formatViews(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K views`;
  return `${count} views`;
}

export function RelatedVideos({ videos }: { videos: InvidiousVideo[] }) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 px-3 sm:px-0">
      {videos.map((video) => {
        const thumbnail =
          video.videoThumbnails?.find((t) => t.quality === "medium")?.url ??
          video.videoThumbnails?.[0]?.url;

        return (
          <Link
            key={video.videoId}
            href={`/app/watch?v=${video.videoId}`}
            className="flex gap-2 rounded-xl p-1.5 hover:bg-neutral-900"
          >
            <div className="relative h-[70px] w-[124px] shrink-0 overflow-hidden rounded-lg bg-neutral-800">
              {thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="line-clamp-2 text-sm font-medium leading-snug text-white">
                {video.title}
              </h4>
              <p className="mt-1 truncate text-xs text-neutral-400">
                {video.author}
              </p>
              <p className="truncate text-xs text-neutral-400">
                {video.viewCountText ?? formatViews(video.viewCount)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
