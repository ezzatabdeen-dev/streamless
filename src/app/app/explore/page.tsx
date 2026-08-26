// src/app/app/explore/page.tsx
import { Compass } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function ExplorePage() {
  return (
    <ComingSoon
      title="Explore"
      icon={Compass}
      description="Category browsing (Music, Gaming, News) isn't built yet."
    />
  );
}
