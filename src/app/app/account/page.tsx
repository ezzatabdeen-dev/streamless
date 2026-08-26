// src/app/app/account/page.tsx
import { User } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function AccountPage() {
  return (
    <ComingSoon
      title="Account"
      icon={User}
      description="Sign-in and account settings aren't built yet — this app currently works without an account."
    />
  );
}
