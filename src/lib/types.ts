/**
 * Domain types shared by the server (Prisma read/write) and the client
 * (lesson renderer, playground, challenge runner).
 */

export type Track = "HTML" | "CSS" | "JAVASCRIPT";

export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "CODE_OUTPUT"
  | "CODE_COMPLETION"
  | "DEBUGGING"
  | "MULTIPLE_ANSWER";

export type CodeFiles = { html: string; css: string; js: string };

// ---------------------------------------------------------------------------
// Lesson content: an ordered list of typed blocks, rendered generically
// ---------------------------------------------------------------------------

export type LessonBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "code"; lang: "html" | "css" | "javascript" | "bash"; code: string; caption?: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | {
      type: "callout";
      variant: "tip" | "warning" | "info" | "best-practice" | "mistake";
      title: string;
      text: string;
    }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "playground"; files: CodeFiles; instructions?: string; height?: number }
  | {
      type: "predict";
      prompt: string;
      code?: string;
      options: string[];
      answerIndex: number;
      explanation: string;
    }
  | { type: "exercise"; prompt: string; checklist: string[]; starter: CodeFiles };

export interface LessonContent {
  objective: string;
  blocks: LessonBlock[];
}

// ---------------------------------------------------------------------------
// Challenge validation: declarative assertions evaluated inside the sandbox
// ---------------------------------------------------------------------------

export type ValidationTest =
  | { kind: "exists"; selector: string; label: string }
  | { kind: "count"; selector: string; expected: number; label: string }
  | { kind: "atLeast"; selector: string; expected: number; label: string }
  | { kind: "attr"; selector: string; attr: string; expected: string; label: string }
  | { kind: "attrPresent"; selector: string; attr: string; label: string }
  | { kind: "tagCount"; tag: string; expected: number; label: string }
  | { kind: "textContains"; selector: string; text: string; label: string }
  | { kind: "cssHasProperty"; property: string; valuePattern: string; label: string }
  | { kind: "cssHasSelector"; pattern: string; label: string };

export interface TestResult {
  label: string;
  passed: boolean;
  detail: string;
}

// ---------------------------------------------------------------------------
// Gamification
// ---------------------------------------------------------------------------

export type XpReason =
  | "LESSON"
  | "QUIZ"
  | "CHALLENGE"
  | "PROJECT"
  | "DAILY_LOGIN"
  | "PERFECT_QUIZ"
  | "BADGE"
  | "HINT_PENALTY";

export interface LevelInfo {
  level: number;
  name: string;
  min: number;
  max: number | null;
  progress: number;
  xpIntoLevel: number;
  xpForNextLevel: number | null;
}

// ---------------------------------------------------------------------------
// Onboarding
// ---------------------------------------------------------------------------

export type ExperienceLevel = "COMPLETE_BEGINNER" | "SOME_EXPERIENCE" | "INTERMEDIATE";

export type LearningGoal =
  | "BUILD_WEBSITES"
  | "BECOME_FRONTEND_DEV"
  | "LEARN_JAVASCRIPT"
  | "BUILD_PROJECTS"
  | "PREPARE_FOR_JOBS";

export const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string; description: string }[] = [
  {
    value: "COMPLETE_BEGINNER",
    label: "Complete beginner",
    description: "I have never written a line of code.",
  },
  {
    value: "SOME_EXPERIENCE",
    label: "Some experience",
    description: "I have tried HTML or CSS but I am not confident.",
  },
  {
    value: "INTERMEDIATE",
    label: "Intermediate",
    description: "I can build a page already and want to go deeper.",
  },
];

export const GOAL_OPTIONS: { value: LearningGoal; label: string; description: string }[] = [
  { value: "BUILD_WEBSITES", label: "Build websites", description: "Publish my own pages online." },
  {
    value: "BECOME_FRONTEND_DEV",
    label: "Become a frontend developer",
    description: "Get job-ready with HTML, CSS and JavaScript.",
  },
  {
    value: "LEARN_JAVASCRIPT",
    label: "Learn JavaScript",
    description: "Focus on programming and interactivity.",
  },
  { value: "BUILD_PROJECTS", label: "Build projects", description: "Learn by shipping real apps." },
  {
    value: "PREPARE_FOR_JOBS",
    label: "Prepare for jobs",
    description: "Structured track with interview-style practice.",
  },
];
