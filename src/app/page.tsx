// src/app/app/page.tsx
import { getPopular, InvidiousError } from "@/lib/invidious";
import { VideoCard } from "@/components/VideoCard";
import { AlertTriangle } from "lucide-react";

// Revalidate the home feed every 5 minutes at the Next.js cache layer
export const revalidate = 300;

export default async function AppHomePage() {
  try {
    const videos = await getPopular();

    if (!videos || videos.length === 0) {
      return (
        <EmptyState message="No trending videos available right now." />
      );
    }

    return (
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
      </div>
    );
  } catch (err) {
    const message =
      err instanceof InvidiousError
        ? `Couldn't reach any video backend (tried ${err.instancesTried.length} instance(s)).`
        : "Something went wrong loading the home feed.";
    return <EmptyState message={message} isError />;
  }
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
