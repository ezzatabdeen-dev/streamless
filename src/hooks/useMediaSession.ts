// src/hooks/useMediaSession.ts
"use client";

import { useEffect } from "react";

interface MediaSessionConfig {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  title: string;
  artist: string;
  artwork?: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function useMediaSession({
  videoRef,
  title,
  artist,
  artwork,
  onNext,
  onPrevious,
}: MediaSessionConfig) {
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      artwork: artwork
        ? [
            { src: artwork, sizes: "96x96", type: "image/jpeg" },
            { src: artwork, sizes: "512x512", type: "image/jpeg" },
          ]
        : [],
    });

    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = null;
      }
    };
  }, [title, artist, artwork]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const video = videoRef.current;
    if (!video) return;

    const actionHandlers: [
      MediaSessionAction,
      MediaSessionActionHandler
    ][] = [
      ["play", () => video.play()],
      ["pause", () => video.pause()],
      [
        "seekbackward",
        (details) => {
          video.currentTime = Math.max(
            0,
            video.currentTime - (details.seekOffset ?? 10)
          );
        },
      ],
      [
        "seekforward",
        (details) => {
          video.currentTime = Math.min(
            video.duration,
            video.currentTime + (details.seekOffset ?? 10)
          );
        },
      ],
      [
        "seekto",
        (details) => {
          if (details.seekTime !== undefined && !details.fastSeek) {
            video.currentTime = details.seekTime;
          }
        },
      ],
    ];

    if (onNext) actionHandlers.push(["nexttrack", () => onNext()]);
    if (onPrevious) actionHandlers.push(["previoustrack", () => onPrevious()]);

    actionHandlers.forEach(([action, handler]) => {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Some actions (e.g. seekto) aren't supported in every browser —
        // fail silently rather than breaking the whole hook.
      }
    });

    return () => {
      actionHandlers.forEach(([action]) => {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          /* noop */
        }
      });
    };
  }, [videoRef, onNext, onPrevious]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !("mediaSession" in navigator)) return;

    const updatePlaybackState = () => {
      navigator.mediaSession.playbackState = video.paused ? "paused" : "playing";
    };
    const updatePositionState = () => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      try {
        navigator.mediaSession.setPositionState({
          duration: video.duration,
          playbackRate: video.playbackRate,
          position: video.currentTime,
        });
      } catch {
        /* position state is best-effort */
      }
    };

    video.addEventListener("play", updatePlaybackState);
    video.addEventListener("pause", updatePlaybackState);
    video.addEventListener("timeupdate", updatePositionState);

    return () => {
      video.removeEventListener("play", updatePlaybackState);
      video.removeEventListener("pause", updatePlaybackState);
      video.removeEventListener("timeupdate", updatePositionState);
    };
  }, [videoRef]);
}
