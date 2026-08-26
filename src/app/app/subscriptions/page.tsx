// src/app/app/subscriptions/page.tsx
import { Users } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function SubscriptionsPage() {
  return (
    <ComingSoon
      title="Subscriptions"
      icon={Users}
      description="Channel subscriptions require account/auth support, which isn't built yet."
    />
  );
}
