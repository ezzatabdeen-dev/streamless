// src/lib/invidious/instances.ts
import "server-only";

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

// Module-level cache. Note: on Vercel serverless this resets per cold start,
// which is fine — it just means the first request after a cold start pays
// the health-check cost, and subsequent warm invocations reuse it.
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
        // Some instances sit behind Cloudflare/anti-bot rules that reject
        // requests with no User-Agent (a common signature of bot traffic).
        // A generic browser-like UA reduces false-positive blocks without
        // impersonating anything specific.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
