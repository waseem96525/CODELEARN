import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Layers } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getCourseProgress, getNextLesson } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrackIcon, TrackChip } from "@/components/track-icon";
import { PageHeader } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Learn",
  description: "Every CodeLearn course, with your progress in each one.",
  robots: { index: false, follow: false },
};

const TRACKS = [
  { value: "ALL", label: "All tracks" },
  { value: "HTML", label: "HTML" },
  { value: "CSS", label: "CSS" },
  { value: "JAVASCRIPT", label: "JavaScript" },
] as const;

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const user = await requireUser("/learn");
  const { track } = await searchParams;

  const [progress, next] = await Promise.all([
    getCourseProgress(user.id),
    getNextLesson(user.id),
  ]);

  const activeTrack = TRACKS.some((t) => t.value === track) ? track! : "ALL";
  const visible =
    activeTrack === "ALL" ? progress : progress.filter((c) => c.track === activeTrack);

  const totalLessons = progress.reduce((sum, c) => sum + c.total, 0);
  const totalDone = progress.reduce((sum, c) => sum + c.completed, 0);
  const overall = totalLessons === 0 ? 0 : Math.round((totalDone / totalLessons) * 100);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader
        title="Learn"
        description="Work through each course in order — every lesson builds on the last."
      >
        {next && (
          <Button asChild>
            <Link href={`/learn/${next.courseSlug}/${next.lessonSlug}`}>
              Continue
              <ArrowRight />
            </Link>
          </Button>
        )}
      </PageHeader>

      {/* ----------------------------- Overall ----------------------------- */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            <p className="text-sm font-semibold">All courses</p>
            <Badge tone="neutral">
              {progress.length} course{progress.length === 1 ? "" : "s"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {totalDone} of {totalLessons} lessons &middot; {overall}% complete
          </p>
        </div>
        <Progress
          value={overall}
          label="Overall course progress"
          className="mt-3"
        />
      </Card>

      {/* -------------------------- Track filters -------------------------- */}
      <nav aria-label="Filter by track" className="flex flex-wrap gap-2">
        {TRACKS.map((t) => (
          <Link
            key={t.value}
            href={t.value === "ALL" ? "/learn" : `/learn?track=${t.value}`}
            aria-current={activeTrack === t.value ? "page" : undefined}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              activeTrack === t.value
                ? "border-primary/30 bg-primary-soft text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {/* --------------------------- Course grid --------------------------- */}
      {visible.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-5" />}
          title="No courses in this track yet"
          description="Try another track, or start with HTML from the full list."
          action="Show all tracks"
          actionHref="/learn"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((course) => {
            const isNext = next?.courseSlug === course.slug;
            return (
              <Card key={course.courseId} interactive className="flex flex-col p-5">
                <div className="flex items-start gap-3">
                  <TrackIcon track={course.track} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-semibold">{course.title}</h2>
                      {course.percent === 100 && (
                        <Badge tone="success">
                          <CheckCircle2 className="size-3" />
                          Complete
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {course.completed} of {course.total} lessons
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <Progress
                    value={course.percent}
                    label={`${course.title} progress`}
                    className={course.percent === 100 ? "[&>div]:bg-success" : undefined}
                  />
                  <p className="text-xs text-muted-foreground">{course.percent}% complete</p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <TrackChip track={course.track} />
                  <Badge tone="neutral">
                    <Clock className="size-3" />
                    {course.total * 10} min
                  </Badge>
                  {isNext && <Badge tone="primary">Up next</Badge>}
                </div>

                <Button
                  asChild
                  size="sm"
                  variant={isNext ? "primary" : "outline"}
                  className="mt-5 w-full"
                >
                  <Link
                    href={
                      isNext
                        ? `/learn/${course.slug}/${next.lessonSlug}`
                        : `/learn/${course.slug}`
                    }
                  >
                    {isNext
                      ? `Continue: ${next.lessonTitle}`
                      : course.percent > 0
                        ? "Continue course"
                        : "Start course"}
                    <ArrowRight />
                  </Link>
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Difficulty shown on each course page. Courses marked with a project badge end with a
        build-it-yourself assignment.
      </p>
    </div>
  );
}
