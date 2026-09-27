"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, PartyPopper, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { completeLesson, type ProgressResult } from "@/app/(app)/actions/progress";
import { formatXp } from "@/lib/utils";

/**
 * "Mark complete" — the point where the learning loop closes: XP, level, streak
 * and any course-completion celebration all come back from the server.
 */
export function LessonActions({
  lessonId,
  courseSlug,
  isCompleted,
  nextHref,
  nextTitle,
  courseCompleted,
  courseName,
}: {
  lessonId: string;
  courseSlug: string;
  isCompleted: boolean;
  nextHref: string | null;
  nextTitle: string | null;
  courseCompleted: boolean;
  courseName: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [result, setResult] = React.useState<ProgressResult | null>(null);
  const [done, setDone] = React.useState(isCompleted);

  function complete() {
    startTransition(async () => {
      const response = await completeLesson(lessonId);
      if (!response.ok) {
        toast.error(response.error ?? "Could not save your progress.");
        return;
      }

      setResult(response);
      setDone(true);
      router.refresh();

      if (response.xpGained > 0) {
        toast.success(`Lesson complete — +${response.xpGained} XP`, {
          description: `You are now level ${response.level} (${response.levelName}).`,
        });
      }
      if (response.levelUp) {
        toast.success(`Level up! You reached level ${response.level}.`, {
          description: response.levelName,
        });
      }
      if (response.streak > 1) {
        toast.success(`🔥 ${response.streak} day streak`, {
          description: "Come back tomorrow to keep it going.",
        });
      }
      for (const badge of response.achievements) {
        toast.success(`🏆 ${badge.name}`, { description: `+${badge.xpReward} XP` });
      }
    });
  }

  if (done && result) {
    return (
      <div className="space-y-4">
        <Card className="border-success/40 bg-success-soft p-6 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-card shadow-card">
            <CheckCircle2 className="size-7 text-success" />
          </div>
          <h2 className="mt-3 text-lg font-bold">Lesson complete</h2>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-card px-3 py-1 text-sm font-semibold text-success">
              <Zap className="size-4" />
              +{result.xpGained} XP
            </span>
            <span className="rounded-full border border-primary/30 bg-card px-3 py-1 text-sm font-semibold">
              Level {result.level} — {result.levelName}
            </span>
            <span className="rounded-full border border-border bg-card px-3 py-1 text-sm font-semibold">
              {formatXp(result.totalXp)} XP total
            </span>
          </div>

          {result.coursePercent > 0 && (
            <div className="mx-auto mt-5 max-w-sm space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{courseName}</span>
                <span>{result.coursePercent}%</span>
              </div>
              <Progress value={result.coursePercent} label="Course progress" />
            </div>
          )}

          {result.achievements.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold">New badges unlocked</p>
              <ul className="mt-2 space-y-1">
                {result.achievements.map((badge) => (
                  <li key={badge.key} className="text-sm text-foreground/90">
                    🏆 {badge.name} — {badge.description}{" "}
                    <span className="text-muted-foreground">+{badge.xpReward} XP</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {courseCompleted && (
            <div className="mt-6 rounded-xl border border-primary/30 bg-card p-4">
              <p className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
                <PartyPopper className="size-4" />
                You finished {courseName}!
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Head to the next course, or build a project to put it all together.
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Button asChild size="sm">
                  <Link href="/learn">Next course</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/projects">Build a project</Link>
                </Button>
              </div>
            </div>
          )}

          {nextHref && (
            <Button asChild size="lg" className="mt-5 w-full sm:w-auto">
              <Link href={nextHref}>
                Next: {nextTitle}
                <ArrowRight />
              </Link>
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <Card className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold">
          {isCompleted ? "Lesson already complete" : "Finished this lesson?"}
        </p>
        <p className="text-sm text-muted-foreground">
          {isCompleted
            ? "You can revisit it any time — the content is always here."
            : "Mark it complete to earn 20 XP and unlock the next lesson."}
        </p>
      </div>
      <Button onClick={complete} loading={pending} disabled={isCompleted}>
        <CheckCircle2 />
        {isCompleted ? "Completed" : "Mark complete"}
      </Button>
    </Card>
  );
}

/** Bookmark toggle shared by lessons, challenges and projects. */
export function LessonBookmarkButton({
  contentId,
  initialBookmarked,
  contentType = "LESSON",
}: {
  contentId: string;
  initialBookmarked: boolean;
  contentType?: "LESSON" | "CHALLENGE" | "PROJECT";
}) {
  const [bookmarked, setBookmarked] = React.useState(initialBookmarked);
  const [pending, startTransition] = React.useTransition();

  function toggle() {
    // Optimistic: the bookmark feels instant, and the server result corrects us.
    const optimistic = !bookmarked;
    setBookmarked(optimistic);

    startTransition(async () => {
      const { toggleBookmark } = await import("@/app/(app)/actions/user-content");
      const response = await toggleBookmark({ contentType, contentId });
      if (!response.ok) {
        setBookmarked(!optimistic);
        toast.error(response.error ?? "Could not update your bookmarks.");
        return;
      }
      setBookmarked(response.bookmarked);
      toast.success(
        response.bookmarked ? "Added to bookmarks" : "Removed from bookmarks",
      );
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      disabled={pending}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this lesson"}
      title={bookmarked ? "Remove bookmark" : "Bookmark this lesson"}
    >
      <svg
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
        aria-hidden
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </Button>
  );
}
