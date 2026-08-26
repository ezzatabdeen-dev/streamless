// src/hooks/useInstallPrompt.ts
"use client";

import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

type InstallState = "unsupported" | "installable" | "installed" | "ios-manual";

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [state, setState] = useState<InstallState>("unsupported");

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;

    if (isStandalone) {
      setState("installed");
      return;
    }

    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isSafari =
      /safari/i.test(window.navigator.userAgent) &&
      !/crios|fxios|chrome/i.test(window.navigator.userAgent);

    if (isIOS && isSafari) {
      setState("ios-manual");
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState("installable");
    };

    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setState("installed");
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return null;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    if (choice.outcome === "accepted") {
      setState("installed");
    } else {
      setState("unsupported");
    }

    return choice.outcome;
  }, [deferredPrompt]);

  return { state, promptInstall };
}
