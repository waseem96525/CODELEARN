import * as React from "react";
import { cn } from "@/lib/utils";

const CVA = "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold";

const TONES = {
  neutral: "border-border bg-muted text-muted-foreground",
  primary: "border-primary/25 bg-primary-soft text-primary",
  success: "border-success/30 bg-success-soft text-success",
  warning: "border-warning/30 bg-warning-soft text-warning",
  danger: "border-danger/30 bg-danger-soft text-danger",
  info: "border-info/30 bg-info-soft text-info",
  html: "border-track-html/30 bg-track-html/10 text-track-html",
  css: "border-track-css/30 bg-track-css/10 text-track-css",
  javascript: "border-track-js/30 bg-track-js/10 text-track-js",
} as const;

export type BadgeTone = keyof typeof TONES;

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return <span className={cn(CVA, TONES[tone], className)} {...props} />;
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const tone: BadgeTone =
    difficulty === "ADVANCED" ? "danger" : difficulty === "INTERMEDIATE" ? "warning" : "success";
  return (
    <Badge tone={tone}>
      {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
    </Badge>
  );
}
