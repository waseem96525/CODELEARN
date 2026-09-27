import type { Criteria } from "@/lib/achievements";

export interface SeedAchievement {
  key: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  criteria: Criteria;
}

/** Badges are evaluated declaratively by src/lib/achievements.ts. */
export const achievements: SeedAchievement[] = [
  {
    key: "first_lesson",
    name: "First Lesson",
    description: "Complete your first lesson.",
    icon: "Trophy",
    xpReward: 25,
    criteria: { type: "lessonsCompleted", count: 1 },
  },
  {
    key: "five_lessons",
    name: "Getting Somewhere",
    description: "Complete five lessons.",
    icon: "Sprout",
    xpReward: 50,
    criteria: { type: "lessonsCompleted", count: 5 },
  },
  {
    key: "twenty_lessons",
    name: "Committed",
    description: "Complete twenty lessons.",
    icon: "Mountain",
    xpReward: 150,
    criteria: { type: "lessonsCompleted", count: 20 },
  },
  {
    key: "streak_3",
    name: "Three Day Streak",
    description: "Learn on three consecutive days.",
    icon: "Flame",
    xpReward: 40,
    criteria: { type: "streak", days: 3 },
  },
  {
    key: "streak_7",
    name: "7 Day Streak",
    description: "Study for 7 consecutive days.",
    icon: "Flame",
    xpReward: 100,
    criteria: { type: "streak", days: 7 },
  },
  {
    key: "streak_30",
    name: "30 Day Streak",
    description: "Study for 30 consecutive days.",
    icon: "Flame",
    xpReward: 400,
    criteria: { type: "streak", days: 30 },
  },
  {
    key: "first_challenge",
    name: "First Challenge",
    description: "Complete your first coding challenge.",
    icon: "Code",
    xpReward: 50,
    criteria: { type: "challengesCompleted", count: 1 },
  },
  {
    key: "five_challenges",
    name: "Problem Solver",
    description: "Complete five coding challenges.",
    icon: "Puzzle",
    xpReward: 120,
    criteria: { type: "challengesCompleted", count: 5 },
  },
  {
    key: "first_project",
    name: "First Project",
    description: "Complete your first project.",
    icon: "Rocket",
    xpReward: 100,
    criteria: { type: "projectsCompleted", count: 1 },
  },
  {
    key: "three_projects",
    name: "Builder",
    description: "Complete three projects.",
    icon: "Hammer",
    xpReward: 250,
    criteria: { type: "projectsCompleted", count: 3 },
  },
  {
    key: "perfect_quiz",
    name: "Perfect Quiz",
    description: "Get 100% on a quiz.",
    icon: "Target",
    xpReward: 75,
    criteria: { type: "perfectQuizzes", count: 1 },
  },
  {
    key: "html_master",
    name: "HTML Master",
    description: "Complete the HTML course.",
    icon: "Globe",
    xpReward: 300,
    criteria: { type: "courseCompleted", track: "HTML" },
  },
  {
    key: "css_builder",
    name: "CSS Builder",
    description: "Complete the CSS course.",
    icon: "Palette",
    xpReward: 300,
    criteria: { type: "courseCompleted", track: "CSS" },
  },
  {
    key: "js_explorer",
    name: "JavaScript Explorer",
    description: "Complete the JavaScript course.",
    icon: "Zap",
    xpReward: 400,
    criteria: { type: "courseCompleted", track: "JAVASCRIPT" },
  },
  {
    key: "note_taker",
    name: "Note Taker",
    description: "Write five personal notes.",
    icon: "NotebookPen",
    xpReward: 60,
    criteria: { type: "notes", count: 5 },
  },
  {
    key: "collector",
    name: "Collector",
    description: "Bookmark ten pieces of content.",
    icon: "Bookmark",
    xpReward: 60,
    criteria: { type: "bookmarks", count: 10 },
  },
  {
    key: "xp_1000",
    name: "Four Figures",
    description: "Earn 1,000 XP.",
    icon: "Star",
    xpReward: 100,
    criteria: { type: "xp", amount: 1000 },
  },
  {
    key: "xp_5000",
    name: "Five Thousand",
    description: "Earn 5,000 XP.",
    icon: "Crown",
    xpReward: 300,
    criteria: { type: "xp", amount: 5000 },
  },
];

export interface SeedPath {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  tier?: string;
  /** Course slugs, in order. */
  courseSlugs: string[];
}

export const paths: SeedPath[] = [
  {
    slug: "beginner-frontend",
    title: "Beginner Frontend Developer",
    description:
      "Start from nothing and work up to building complete websites. HTML, then CSS, then the JavaScript you actually need.",
    emoji: "🚀",
    tier: "FREE",
    courseSlugs: ["html", "css", "javascript"],
  },
  {
    slug: "html-css-foundations",
    title: "HTML & CSS Foundations",
    description:
      "Focus purely on building and designing pages. The fastest route to being able to publish a website.",
    emoji: "🎨",
    tier: "FREE",
    courseSlugs: ["html", "css"],
  },
  {
    slug: "javascript-developer",
    title: "JavaScript Developer",
    description:
      "Go deep on programming: fundamentals, functions, arrays, objects, the DOM and async JavaScript.",
    emoji: "⚡",
    tier: "PREMIUM",
    courseSlugs: ["javascript"],
  },
];
