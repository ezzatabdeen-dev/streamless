// src/app/app/liked/page.tsx
import { ThumbsUp } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function LikedPage() {
  return (
    <ComingSoon
      title="Liked Videos"
      icon={ThumbsUp}
      description="Liking and saving videos isn't built yet."
    />
  );
}
