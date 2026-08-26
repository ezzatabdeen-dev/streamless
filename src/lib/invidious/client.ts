// src/lib/invidious/client.ts
import "server-only";
import { getHealthyInstance, getInstancePool, blacklistInstance } from "./instances";

const REQUEST_TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 3;

export class InvidiousError extends Error {
  constructor(message: string, public readonly instancesTried: string[]) {
    super(message);
    this.name = "InvidiousError";
  }
}

async function doFetch(
  instance: string,
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<unknown> {
  const url = new URL(`${instance}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Instance responded with status ${res.status}`);
    }

    return await res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function invidiousFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const tried: string[] = [];
  let lastError: unknown = null;

  let instance = await getHealthyInstance();

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    tried.push(instance);
    try {
      const data = await doFetch(instance, path, params);
      return data as T;
    } catch (err) {
      lastError = err;
      blacklistInstance(instance);

      const pool = getInstancePool().filter((i) => !tried.includes(i));
      if (pool.length === 0) break;
      instance = pool[0];
    }
  }

  throw new InvidiousError(
    `All Invidious instances failed after ${tried.length} attempt(s): ${
      lastError instanceof Error ? lastError.message : "unknown error"
    }`,
    tried
  );
}
