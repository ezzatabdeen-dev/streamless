// src/app/app/shorts/page.tsx
import { Clapperboard } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function ShortsPage() {
  return (
    <ComingSoon
      title="Shorts"
      icon={Clapperboard}
      description="Short-form video browsing isn't built yet."
    />
  );
}
