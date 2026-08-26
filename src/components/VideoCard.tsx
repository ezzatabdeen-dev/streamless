// src/components/VideoCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { InvidiousVideo } from "@/lib/invidious";

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "LIVE";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function formatViews(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K views`;
  return `${count} views`;
}

export function VideoCard({ video }: { video: InvidiousVideo }) {
  const thumbnail =
    video.videoThumbnails?.find((t) => t.quality === "medium")?.url ??
    video.videoThumbnails?.[0]?.url;

  return (
    <Link href={`/app/watch?v=${video.videoId}`} className="group block">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-900">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-600">
            <Clock className="h-6 w-6" />
          </div>
        )}
        {video.lengthSeconds > 0 && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {formatDuration(video.lengthSeconds)}
          </span>
        )}
        {video.liveNow && (
          <span className="absolute left-1.5 top-1.5 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Live
          </span>
        )}
      </div>

      <div className="mt-2 flex gap-2.5">
        <div className="mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-full bg-neutral-800">
          {video.authorThumbnails?.[0]?.url && (
            <Image
              src={video.authorThumbnails[0].url}
              alt={video.author}
              width={36}
              height={36}
              className="h-full w-full object-cover"
              unoptimized
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-white">
            {video.title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-neutral-400">
            {video.author}
          </p>
          <p className="truncate text-xs text-neutral-400">
            {video.viewCountText ?? formatViews(video.viewCount)} ·{" "}
            {video.publishedText}
          </p>
        </div>
      </div>
    </Link>
  );
}
