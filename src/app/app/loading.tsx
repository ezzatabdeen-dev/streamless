// src/app/app/loading.tsx
// Still useful as Next's route-level fallback during the brief moment the
// page's client JS is being loaded/hydrated on navigation. The actual
// data-fetch loading state (once the page has mounted) is now handled
// inside page.tsx itself via useAsyncData — this and that use the exact
// same VideoGridSkeleton so there's no visual jump between the two.
import { VideoGridSkeleton } from "@/components/VideoGridSkeleton";

export default function HomeLoading() {
  return <VideoGridSkeleton />;
}
