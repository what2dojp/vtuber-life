"use client";

import { create } from "zustand";
import { initPRNG } from "@/lib/prng";

export interface PlayerStats {
  name: string;
  seed: string;
  month: number;
  fans: number;
  san: number;
  talk: number;
  singing: number;
  tech: number;
  drama: number;
  isGraduated: boolean;
  logs: string[];
}

interface GameActions {
  initGame: (name: string, seed: string) => void;
  applyEventResult: (changes: Partial<PlayerStats>, logText: string) => void;
  nextMonth: () => void;
}

export type GameStore = PlayerStats & GameActions;

const INITIAL_STATS: PlayerStats = {
  name: "預設V子",
  seed: "v-life-2026",
  month: 1,
  fans: 100,
  san: 100,
  talk: 10,
  singing: 10,
  tech: 10,
  drama: 0,
  isGraduated: false,
  logs: [],
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function atLeastZero(value: number): number {
  return Math.max(0, value);
}

export const useGameStore = create<GameStore>()((set) => ({
  ...INITIAL_STATS,

  initGame: (name, seed) => {
    initPRNG(seed);

    set({
      name,
      seed,
      month: 1,
      fans: 100,
      san: 100,
      talk: 10,
      singing: 10,
      tech: 10,
      drama: 0,
      isGraduated: false,
      logs: [`【第 1 個月】${name} 個人勢初配信出道！`],
    });
  },

  applyEventResult: (changes, logText) => {
    set((state) => {
      const san = clamp(changes.san ?? state.san, 0, 100);
      const month = changes.month ?? state.month;

      return {
        name: changes.name ?? state.name,
        seed: changes.seed ?? state.seed,
        month,
        fans: atLeastZero(changes.fans ?? state.fans),
        san,
        talk: atLeastZero(changes.talk ?? state.talk),
        singing: atLeastZero(changes.singing ?? state.singing),
        tech: atLeastZero(changes.tech ?? state.tech),
        drama: atLeastZero(changes.drama ?? state.drama),
        isGraduated: san <= 0 || month > 36,
        logs: [logText, ...state.logs],
      };
    });
  },

  nextMonth: () => {
    set((state) => {
      const month = state.month + 1;

      return {
        month,
        ...(month > 36 ? { isGraduated: true } : {}),
      };
    });
  },
}));
