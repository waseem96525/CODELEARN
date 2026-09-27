import type { LessonBlock, QuestionType } from "@/lib/types";

/**
 * Seed content model. Kept separate from `seed.ts` so authoring content is a
 * data task, not a scripting task.
 */
export interface SeedLesson {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty?: string;
  isProject?: boolean;
  objective: string;
  blocks: LessonBlock[];
}

export interface SeedQuestion {
  question: string;
  type?: QuestionType;
  code?: string;
  explanation: string;
  xpReward?: number;
  options: { text: string; correct: boolean }[];
}

export interface SeedLessonFull extends SeedLesson {
  questions: SeedQuestion[];
}

export interface SeedCourse {
  title: string;
  slug: string;
  description: string;
  tagline: string;
  track: string;
  difficulty?: string;
  icon: string;
  accent: string;
  lessons: SeedLessonFull[];
}
