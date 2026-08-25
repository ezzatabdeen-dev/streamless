// src/app/page.tsx
import Link from "next/link";
import { ShieldOff, PlayCircle, Zap, ArrowRight } from "lucide-react";
import { InstallButton } from "@/components/InstallButton";

const features = [
  {
    icon: ShieldOff,
    title: "Zero Ads",
    description: "No pre-roll, mid-roll, or banner ads. Ever.",
  },
  {
    icon: PlayCircle,
    title: "Background Play",
    description: "Keep listening with your screen off or app minimized.",
  },
  {
    icon: Zap,
    title: "Lightweight & Fast",
    description: "No tracking, no bloat — just video.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 shadow-lg shadow-black/50">
          <PlayCircle className="h-8 w-8 text-brand" />
        </div>

        <h1 className="max-w-md text-4xl font-bold tracking-tight sm:text-5xl">
          YouTube, minus the noise.
        </h1>

        <p className="mt-4 max-w-sm text-base text-neutral-400">
          Streamless is an ad-free, privacy-first video client with true
          background playback — installable straight to your home screen.
        </p>

        <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
          <InstallButton />
          <Link
            href="/app"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-800 px-6 py-3.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-900"
          >
            Continue in Browser
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 text-left"
            >
              <Icon className="mb-3 h-5 w-5 text-brand" />
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="mt-1 text-xs text-neutral-400">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="relative z-10 pb-6 text-center text-xs text-neutral-600">
        Not affiliated with YouTube or Google LLC.
      </footer>
    </main>
  );
}
