// src/app/app/search/page.tsx
import { searchVideos, InvidiousError } from "@/lib/invidious";
import type { InvidiousVideo } from "@/lib/invidious";
import { VideoCard } from "@/components/VideoCard";
import { SearchX, AlertTriangle } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <StatusMessage icon={SearchX} message="Type something to search for." />
    );
  }

  try {
    const results = await searchVideos(query, { type: "video" });
    const videos = results.filter(
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
  } catch (err) {
    const message =
      err instanceof InvidiousError
        ? "Search backend is temporarily unreachable. Try again shortly."
        : "Something went wrong while searching.";
    return <StatusMessage icon={AlertTriangle} message={message} isError />;
  }
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
