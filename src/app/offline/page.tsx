// src/app/offline/page.tsx
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <WifiOff className="h-12 w-12 text-neutral-500" />
      <h1 className="text-xl font-semibold">You&apos;re offline</h1>
      <p className="max-w-sm text-sm text-neutral-400">
        Check your connection. Previously loaded pages may still be
        available from cache.
      </p>
    </div>
  );
}
