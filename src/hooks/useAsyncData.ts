// src/hooks/useAsyncData.ts
"use client";

import { useEffect, useState } from "react";

type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: unknown };

/**
 * Generic client-side data-fetching hook. Replaces the "await inside a
 * Server Component" pattern from the original build — Invidious calls now
 * happen in the browser (see the architecture note in
 * src/lib/invidious/instances.ts), so each page that needs data manages
 * its own loading/success/error state via this hook instead.
 *
 * `deps` works exactly like a useEffect dependency array — pass the values
 * the fetch depends on (e.g. a search query or video ID) so it re-fetches
 * when they change.
 */
export function useAsyncData<T>(
  fn: () => Promise<T>,
  deps: React.DependencyList
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    fn()
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((error) => {
        if (!cancelled) setState({ status: "error", error });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
    }
