// src/components/player/VideoPlayer.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useHls } from "@/hooks/useHls";
import { useMediaSession } from "@/hooks/useMediaSession";
import { usePlayerStore } from "@/store/usePlayerStore";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  hlsUrl: string;
  title: string;
  author: string;
  thumbnail?: string;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function VideoPlayer({
  hlsUrl,
  title,
  author,
  thumbnail,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [controlsVisible, setControlsVisible] = useState(true);
  const { isPlaying, isMuted, currentTime, duration, setPlaying, setMuted, setProgress } =
    usePlayerStore();

  const status = useHls(videoRef, hlsUrl);
  useMediaSession({ videoRef, title, artist: author, artwork: thumbnail });

  useEffect(() => {
    if (status === "ready" && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked — user will need to tap play manually.
      });
    }
  }, [status]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [setPlaying]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, [setMuted]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen().catch(() => {
        /* fullscreen API can be denied by browser policy */
      });
    }
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Number(e.target.value);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setProgress(video.currentTime, video.duration || 0);
  }, [setProgress]);

  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setControlsVisible(false);
      }
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="group relative aspect-video w-full overflow-hidden bg-black"
      onMouseMove={showControlsTemporarily}
      onClick={showControlsTemporarily}
    >
      <video
        ref={videoRef}
        className="h-full w-full"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
      />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 className="h-10 w-10 animate-spin text-white/80" />
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black text-center">
          <AlertTriangle className="h-8 w-8 text-brand" />
          <p className="max-w-xs text-sm text-neutral-300">
            This video stream couldn&apos;t be loaded. The source instance may
            be rate-limiting or geofencing this video.
          </p>
        </div>
      )}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pb-2 pt-8 transition-opacity duration-200",
          controlsVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="h-1 w-full cursor-pointer accent-brand"
          aria-label="Seek"
        />
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-white text-white" />
              ) : (
                <Play className="h-5 w-5 fill-white text-white" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-white" />
              ) : (
                <Volume2 className="h-5 w-5 text-white" />
              )}
            </button>
            <span className="text-xs text-neutral-200">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            aria-label="Fullscreen"
          >
            <Maximize className="h-4.5 w-4.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
