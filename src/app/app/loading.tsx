// src/app/app/loading.tsx

function VideoCardSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="aspect-video w-full rounded-xl bg-neutral-900" />
      <div className="flex gap-2.5">
        <div className="h-9 w-9 shrink-0 rounded-full bg-neutral-900" />
        <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
          <div className="h-3.5 w-full rounded bg-neutral-900" />
          <div className="h-3.5 w-4/5 rounded bg-neutral-900" />
          <div className="h-3 w-2/5 rounded bg-neutral-900" />
        </div>
      </div>
    </div>
  );
}

export default function HomeLoading() {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}
