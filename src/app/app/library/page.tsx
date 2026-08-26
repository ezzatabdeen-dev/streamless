// src/app/app/library/page.tsx
import { Library } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function LibraryPage() {
  return (
    <ComingSoon
      title="Library"
      icon={Library}
      description="Your saved playlists, history, and watch-later list will live here."
    />
  );
}
