// src/components/player/VideoMeta.tsx
import { ThumbsUp, Share2, Download } from "lucide-react";

interface VideoMetaProps {
  title: string;
  author: string;
  authorThumbnail?: string;
  subCountText?: string;
  likeCount?: number;
}

function formatCount(count?: number): string {
  if (!count) return "0";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

export function VideoMeta({
  title,
  author,
  authorThumbnail,
  subCountText,
  likeCount,
}: VideoMetaProps) {
  return (
    <div className="px-3 pt-3">
      <h1 className="text-base font-semibold leading-snug text-white sm:text-lg">
        {title}
      </h1>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-neutral-800">
            {authorThumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={authorThumbnail}
                alt={author}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{author}</p>
            {subCountText && (
              <p className="truncate text-xs text-neutral-400">
                {subCountText} subscribers
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-700">
            <ThumbsUp className="h-3.5 w-3.5" />
            {formatCount(likeCount)}
          </button>
          <button
            className="rounded-full bg-neutral-800 p-2 hover:bg-neutral-700"
            aria-label="Share"
          >
            <Share2 className="h-3.5 w-3.5 text-white" />
          </button>
          <button
            className="rounded-full bg-neutral-800 p-2 hover:bg-neutral-700"
            aria-label="Download"
          >
            <Download className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
