import {
  Braces,
  Code2,
  Code,
  Crown,
  FileCode2,
  Flame,
  Globe,
  Hammer,
  Mountain,
  NotebookPen,
  Palette,
  Puzzle,
  Rocket,
  Sparkles,
  Sprout,
  Star,
  Target,
  Trophy,
  Zap,
  Bookmark,
  type LucideIcon,
} from "lucide-react";

/**
 * The seed stores icon names as strings so content is data, not code.
 * This is the single place those names resolve to components.
 */
const ICONS: Record<string, LucideIcon> = {
  Braces,
  Code,
  Code2,
  Crown,
  FileCode2,
  Flame,
  Globe,
  Hammer,
  Mountain,
  NotebookPen,
  Palette,
  Puzzle,
  Rocket,
  Sparkles,
  Sprout,
  Star,
  Target,
  Trophy,
  Zap,
  Bookmark,
};

export function iconFor(name: string): LucideIcon {
  return ICONS[name] ?? Sparkles;
}

export const TRACK_TONE: Record<string, "html" | "css" | "javascript"> = {
  HTML: "html",
  CSS: "css",
  JAVASCRIPT: "javascript",
};
