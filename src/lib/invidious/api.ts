// src/lib/invidious/api.ts
import "server-only";
import { invidiousFetch } from "./client";
import type {
  InvidiousVideo,
  SearchResultItem,
  InvidiousVideoDetail,
} from "./types";

/** Home feed: trending videos. */
export async function getPopular(): Promise<InvidiousVideo[]> {
  return invidiousFetch<InvidiousVideo[]>("/api/v1/popular");
}

export async function getTrending(options?: {
  region?: string;
  type?: "music" | "gaming" | "movies" | "news";
}): Promise<InvidiousVideo[]> {
  return invidiousFetch<InvidiousVideo[]>("/api/v1/trending", {
    region: options?.region,
    type: options?.type,
  });
}

export interface SearchOptions {
  page?: number;
  sort?: "relevance" | "rating" | "upload_date" | "view_count";
  type?: "video" | "channel" | "playlist" | "all";
  duration?: "short" | "long";
}

export async function searchVideos(
  query: string,
  options?: SearchOptions
): Promise<SearchResultItem[]> {
  if (!query.trim()) return [];
  return invidiousFetch<SearchResultItem[]>("/api/v1/search", {
    q: query,
    page: options?.page ?? 1,
    sort_by: options?.sort ?? "relevance",
    type: options?.type ?? "video",
    duration: options?.duration,
  });
}

/** Full video detail including playable stream URLs. */
export async function getVideoDetail(
  videoId: string
): Promise<InvidiousVideoDetail> {
  return invidiousFetch<InvidiousVideoDetail>(`/api/v1/videos/${videoId}`);
}
