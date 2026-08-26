// src/store/usePlayerStore.ts
import { create } from "zustand";

interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  setPlaying: (playing: boolean) => void;
  setMuted: (muted: boolean) => void;
  setProgress: (currentTime: number, duration: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  setPlaying: (isPlaying) => set({ isPlaying }),
  setMuted: (isMuted) => set({ isMuted }),
  setProgress: (currentTime, duration) => set({ currentTime, duration }),
}));
