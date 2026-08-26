// src/app/app/watch/loading.tsx

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

export default function WatchLoading() {
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
