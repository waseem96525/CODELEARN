import type { LevelInfo } from "@/lib/types";

/**
 * The level ladder and the maths that reads it.
 *
 * Deliberately free of `server-only` and of Prisma: the same numbers are needed
 * by client components (the level pill in the sidebar, the certificate page's
 * level name) as by the server, and duplicating the thresholds would let the two
 * drift apart.
 */

/** Cumulative XP thresholds, lowest match wins. */
export const LEVELS: { level: number; name: string; min: number }[] = [
  { level: 1, name: "Beginner", min: 0 },
  { level: 2, name: "Explorer", min: 500 },
  { level: 3, name: "Coder", min: 1500 },
  { level: 4, name: "Developer", min: 3000 },
  { level: 5, name: "Frontend Builder", min: 5000 },
  { level: 6, name: "Craftsperson", min: 8000 },
  { level: 7, name: "Senior Coder", min: 12000 },
  { level: 8, name: "Expert", min: 18000 },
  { level: 9, name: "Mentor", min: 26000 },
  { level: 10, name: "CodeLearn Master", min: 40000 },
];

export const XP_REWARDS = {
  LESSON: 20,
  QUIZ: 30,
  PERFECT_QUIZ: 25,
  CHALLENGE: 50,
  PROJECT: 200,
  DAILY_LOGIN: 10,
} as const;

export function getLevelInfo(xp: number): LevelInfo {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].min) idx = i;
  }
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1] ?? null;
  const span = next ? next.min - current.min : 0;
  const xpIntoLevel = xp - current.min;

  return {
    level: current.level,
    name: current.name,
    min: current.min,
    max: next ? next.min - 1 : null,
    progress: span === 0 ? 100 : Math.round((xpIntoLevel / span) * 100),
    xpIntoLevel,
    xpForNextLevel: next ? next.min - xp : null,
  };
}
