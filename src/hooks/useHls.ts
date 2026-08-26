// src/hooks/useHls.ts
"use client";

import { useEffect, useState } from "react";
import Hls from "hls.js";

type HlsStatus = "idle" | "loading" | "ready" | "error";

export function useHls(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  src: string | null
) {
  const [status, setStatus] = useState<HlsStatus>("idle");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setStatus("loading");

    // Case 1: Native HLS support (Safari desktop + iOS). hls.js explicitly
    // recommends NOT using itself here — native decoding is more efficient
    // and battery-friendly, which matters a lot for mobile background play.
    const canPlayNatively =
      video.canPlayType("application/vnd.apple.mpegurl") !== "";

    if (canPlayNatively) {
      video.src = src;
      const onLoaded = () => setStatus("ready");
      const onError = () => setStatus("error");
      video.addEventListener("loadedmetadata", onLoaded);
      video.addEventListener("error", onError);
      return () => {
        video.removeEventListener("loadedmetadata", onLoaded);
        video.removeEventListener("error", onError);
      };
    }

    // Case 2: MSE-based hls.js for everything else
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        enableWorker: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => setStatus("ready"));

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setStatus("error");
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    }

    setStatus("error");
  }, [videoRef, src]);

  return status;
}
