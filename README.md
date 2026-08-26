# Streamless — Ad-Free YouTube PWA

A privacy-first, installable Progressive Web App for watching YouTube content ad-free, with true background/lock-screen playback. Built on Next.js 14 (App Router) and powered by the open-source [Invidious](https://docs.invidious.io/) API — no YouTube API key, no tracking, no ads.

> Not affiliated with YouTube or Google LLC. This project is a client for publicly available Invidious instances.

## ✨ Features

- **Zero ads** — video streams are fetched directly, bypassing YouTube's ad injection entirely
- **Installable PWA** — Add to Home Screen on Android (native install prompt) and iOS (guided manual instructions), powered by a Serwist-managed service worker
- **True background playback** — uses the `MediaSession` API so video/audio keeps playing with the screen locked or the app backgrounded, with lock-screen transport controls (play/pause/seek)
- **Adaptive streaming (HLS)** — `hls.js` on Chromium/Firefox, native HLS on Safari/iOS for better battery efficiency
- **Automatic instance failover** — races multiple Invidious instances on load, caches the fastest healthy one, and automatically retries a different instance if a request fails mid-session
- **YouTube-like UI** — bottom nav on mobile, collapsible sidebar on desktop, expandable descriptions, related video feed

## 🧱 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router, React Server Components) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| PWA / Service Worker | `@serwist/next` |
| State Management | Zustand |
| Video Streaming | `hls.js` (+ native HLS on Safari) |
| Data Source | Invidious API |
| Deployment Target | Vercel |

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page (install prompt)
│   ├── manifest.ts           # PWA manifest
│   ├── offline/page.tsx      # Offline fallback route
│   └── app/
│       ├── layout.tsx        # App shell (TopNav, Sidebar, BottomNav)
│       ├── page.tsx          # Home feed
│       ├── loading.tsx       # Home feed skeleton
│       ├── search/page.tsx   # Search results
│       └── watch/
│           ├── page.tsx      # Video player + metadata
│           └── loading.tsx   # Watch page skeleton
├── components/
│   ├── layout/                # TopNav, Sidebar, BottomNav
│   └── player/                 # VideoPlayer, VideoMeta, VideoDescription, RelatedVideos
├── hooks/
│   ├── useInstallPrompt.ts     # A2HS install logic
│   ├── useHls.ts               # HLS loading (hls.js + native fallback)
│   └── useMediaSession.ts      # Lock-screen / background playback
├── lib/
│   └── invidious/
│       ├── instances.ts        # Health-check + failover logic
│       ├── client.ts           # Resilient fetch wrapper with retries
│       ├── api.ts               # getPopular, searchVideos, getVideoDetail
│       └── types.ts
├── store/
│   ├── useUIStore.ts           # Sidebar collapse state (persisted)
│   └── usePlayerStore.ts       # Playback state
└── sw.ts                        # Service worker source (Serwist)
```

## 🔧 Environment Variables

Create a `.env.local` file in the project root (or set these in Vercel's dashboard under **Settings → Environment Variables**):

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_INVIDIOUS_INSTANCES` | No | Comma-separated list of Invidious instance base URLs, used as the failover pool. If unset, a built-in default list is used. |

Example:

```bash
NEXT_PUBLIC_INVIDIOUS_INSTANCES=https://invidious.io.lol,https://iv.ggtyler.dev,https://invidious.jing.rocks,https://yewtu.be
```

> **Finding healthy instances:** Public Invidious instance uptime fluctuates. Check [https://api.invidious.io/](https://api.invidious.io/) for a live-updated list of instances and their current status/CORS support before deploying, and periodically review this list post-launch.

## 🚀 Deploying to Vercel

### Option A: Deploy from GitHub (recommended)

1. Push this project to a new GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel will auto-detect Next.js — no build command changes needed.
4. Under **Environment Variables**, add `NEXT_PUBLIC_INVIDIOUS_INSTANCES` (optional — see above).
5. Click **Deploy**.

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

Follow the prompts to link the project and set environment variables when asked.

### Post-Deploy Checklist

- [ ] Visit the deployed landing page (`/`) on an Android Chrome device and confirm the native **Install App** button triggers the A2HS prompt
- [ ] Visit on iOS Safari and confirm the manual install sheet (Share → Add to Home Screen) displays correctly
- [ ] Install the app to home screen, launch it standalone, and confirm the status bar/theme color looks correct
- [ ] Play a video, lock the screen (or switch apps), and confirm playback continues with working lock-screen controls
- [ ] Turn on airplane mode after first load and confirm the `/offline` fallback renders for uncached routes
- [ ] Replace the placeholder SVG/data-URI icons in `src/app/manifest.ts` and `src/app/layout.tsx` with real PNG assets once you're back at a machine with a terminal (see below)

## 🎨 Replacing Placeholder Icons

The current build ships with SVG-only manifest icons and an inline base64 placeholder for the iOS `apple-touch-icon`, chosen specifically so the project builds with zero terminal/script dependency. To upgrade to real PNGs later:

```bash
npm install -D sharp-cli
./scripts/gen-icons.sh
```

(Or run the individual `npx sharp` commands inside `scripts/gen-icons.sh` manually.)

Then update `src/app/manifest.ts` and the `icons.apple` field in `src/app/layout.tsx` to point at the new PNG paths instead of the SVG/data-URI versions.

## 🏗️ Local Development

```bash
npm install
npm run dev
```

Note: the service worker is **disabled in development** (see `next.config.ts`) to avoid stale-cache debugging headaches. Test PWA/offline behavior against a production build:

```bash
npm run build
npm run start
```

## ⚠️ Known Limitations

- **Public instance reliability**: Invidious instances are community-run and can go offline, rate-limit, or geofence certain videos without notice. The failover system mitigates but cannot fully eliminate this — for guaranteed uptime, consider [self-hosting your own Invidious instance](https://docs.invidious.io/installation/). The current `DEFAULT_INSTANCES` list in `src/lib/invidious/instances.ts` reflects the officially-vetted list at the time of writing; check [docs.invidious.io/instances](https://docs.invidious.io/instances/) periodically and update `NEXT_PUBLIC_INVIDIOUS_INSTANCES` in Vercel if the home feed or search stop returning results.
- **HLS availability**: not every video/instance combination returns an `hlsUrl`. The watch page surfaces a clear error state when this happens rather than failing silently.
- **Placeholder sections**: `Shorts`, `Subscriptions`, `Library`, `Explore`, `Account`, `History`, `Watch Later`, and `Liked Videos` are all linked from the Sidebar/BottomNav (Phase 3 navigation scaffold) but only render a "Coming Soon" placeholder (`src/components/shared/ComingSoon.tsx`) — only Home, Search, and Watch are fully implemented. This is intentional scope from the original build plan, not a bug.
- **Serverless cold starts**: the instance health-check cache resets on Vercel cold starts (since it's in-memory, not persisted). The first request after a cold start pays a one-time health-check cost of up to ~3 seconds.

## 📄 License

This project is provided as-is for personal/educational use. It is not affiliated with, endorsed by, or connected to YouTube or Google LLC in any way.
