// src/lib/invidious/types.ts

export interface VideoThumbnail {
  quality: string;
  url: string;
  width: number;
  height: number;
}

export interface InvidiousVideo {
  type: "video";
  videoId: string;
  title: string;
  videoThumbnails: VideoThumbnail[];
  lengthSeconds: number;
  viewCount: number;
  viewCountText?: string;
  author: string;
  authorId: string;
  authorUrl: string;
  authorThumbnails?: { url: string; width: number; height: number }[];
  published: number;
  publishedText: string;
  liveNow?: boolean;
  isUpcoming?: boolean;
}

export interface InvidiousChannel {
  type: "channel";
  author: string;
  authorId: string;
  authorThumbnails?: { url: string; width: number; height: number }[];
  subCount?: number;
  videoCount?: number;
  description?: string;
}

export interface InvidiousPlaylist {
  type: "playlist";
  title: string;
  playlistId: string;
  author: string;
  videoCount: number;
  videos: Partial<InvidiousVideo>[];
}

export type SearchResultItem =
  | InvidiousVideo
  | InvidiousChannel
  | InvidiousPlaylist;

export interface InvidiousFormatStream {
  url: string;
  itag: string;
  type: string;
  quality: string;
  qualityLabel?: string;
  bitrate?: string;
  container?: string;
  encoding?: string;
  resolution?: string;
  size?: string;
}

export interface InvidiousVideoDetail extends InvidiousVideo {
  description: string;
  descriptionHtml?: string;
  formatStreams: InvidiousFormatStream[];
  adaptiveFormats: InvidiousFormatStream[];
  hlsUrl?: string;
  dashUrl?: string;
  recommendedVideos?: InvidiousVideo[];
  subCountText?: string;
  likeCount?: number;
  dislikeCount?: number;
}

export interface InstanceStats {
  version?: string;
  openRegistrations?: boolean;
  software?: { name: string; version: string };
}
