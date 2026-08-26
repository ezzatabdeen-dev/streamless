// src/app/app/watch-later/page.tsx
import { Clock } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function WatchLaterPage() {
  return (
    <ComingSoon
      title="Watch Later"
      icon={Clock}
      description="Saving videos to watch later isn't built yet."
    />
  );
}
