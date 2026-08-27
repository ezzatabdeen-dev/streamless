// src/lib/invidious/instances.ts
//
// ARCHITECTURE NOTE: This module now runs CLIENT-SIDE (in the browser),
// not on the Vercel server. Why: many public Invidious instances sit
// behind Cloudflare/anti-bot protection that blocks or challenges requests
// coming from known datacenter/cloud IP ranges (which is exactly what
// Vercel's serverless functions use). A request from the user's own
// browser looks like completely normal traffic to those instances, so
// running the failover logic here — instead of in a Server Component —
// is what actually gets past that blocking.
//
// Practical implication: no "server-only" import anymore (this file is
// intentionally bundled into client JS), and the module-level cache below
// now lives per-browser-tab instead of per-serverless-invocation — which
// is arguably better, since it's now scoped to a single real user/session.

// NOTE: Public Invidious instances rotate/die frequently — this list
// reflects the officially-vetted instances at https://docs.invidious.io/instances/
// as of this build. If ALL instances fail (see the empty-state message
// surfaced in the UI), check that page for the current list and override
// via the NEXT_PUBLIC_INVIDIOUS_INSTANCES env var in Vercel — no code
// change needed, just update the env var and redeploy.
const DEFAULT_INSTANCES = [
  "https://yewtu.be",
  "https://invidious.tiekoetter.com",
  "https://invidious.nerdvpn.de",
  "https://yt.chocolatemoo53.com",
];

function getConfiguredInstances(): string[] {
  const raw = process.env.NEXT_PUBLIC_INVIDIOUS_INSTANCES;
  if (!raw) return DEFAULT_INSTANCES;
  return raw
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

const HEALTH_CHECK_TIMEOUT_MS = 3000;
const CACHE_TTL_MS = 5 * 60 * 1000; // re-validate every 5 minutes

// Module-level cache. Now scoped to the browser tab's lifetime (resets on
// a full page reload, persists across client-side route navigations).
let cachedInstance: { url: string; checkedAt: number } | null = null;
const blacklist = new Map<string, number>(); // url -> blacklisted-until timestamp
const BLACKLIST_DURATION_MS = 60 * 1000;

async function fetchWithTimeout(
  url: string,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        // NOTE: We intentionally do NOT set a "User-Agent" header here —
        // browsers treat it as a forbidden/restricted header and silently
        // ignore any value you set, always sending the browser's real UA
        // instead. That's actually what we want: a genuine browser UA is
        // far less likely to get blocked than a hand-crafted one.
      },
      cache: "no-store",
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

function isBlacklisted(url: string): boolean {
  const until = blacklist.get(url);
  if (!until) return false;
  if (Date.now() > until) {
    blacklist.delete(url);
    return false;
  }
  return true;
}

export function blacklistInstance(url: string) {
  blacklist.set(url, Date.now() + BLACKLIST_DURATION_MS);
  if (cachedInstance?.url === url) {
    cachedInstance = null;
  }
}

/**
 * Races /api/v1/stats across all candidate instances and returns the URL
 * of whichever responds successfully first.
 */
async function raceForHealthyInstance(
  candidates: string[]
): Promise<string | null> {
  if (candidates.length === 0) return null;

  return new Promise((resolve) => {
    let settled = false;
    let remaining = candidates.length;

    candidates.forEach((instance) => {
      fetchWithTimeout(`${instance}/api/v1/stats`, HEALTH_CHECK_TIMEOUT_MS)
        .then((res) => {
          if (!settled && res.ok) {
            settled = true;
            resolve(instance);
          } else {
            remaining -= 1;
            if (remaining === 0 && !settled) resolve(null);
          }
        })
        .catch(() => {
          remaining -= 1;
          if (remaining === 0 && !settled) resolve(null);
        });
    });
  });
}

export async function getHealthyInstance(): Promise<string> {
  const now = Date.now();

  if (cachedInstance && now - cachedInstance.checkedAt < CACHE_TTL_MS) {
    return cachedInstance.url;
  }

  const all = getConfiguredInstances();
  const candidates = all.filter((i) => !isBlacklisted(i));
  const pool = candidates.length > 0 ? candidates : all;

  const winner = await raceForHealthyInstance(pool);

  if (winner) {
    cachedInstance = { url: winner, checkedAt: now };
    return winner;
  }

  return all[0];
}

export function getInstancePool(): string[] {
  return getConfiguredInstances().filter((i) => !isBlacklisted(i));
}
