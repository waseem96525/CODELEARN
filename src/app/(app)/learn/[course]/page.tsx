import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Circle, Clock, FolderGit } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getCompletedLessonIds, getCourseBySlug, getCourseProgress } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrackIcon } from "@/components/track-icon";
import { CourseSidebar, type CourseLesson } from "@/components/course-sidebar";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/learn/[course]">): Promise<Metadata> {
  const { course: courseSlug } = await params;
  const course = await getCourseBySlug(courseSlug);
  if (!course) return { title: "Course not found" };

  return {
    title: course.title,
    description: course.description,
    alternates: { canonical: `/learn/${course.slug}` },
    openGraph: {
      title: `${course.title} | CodeLearn`,
      description: course.description,
    },
  };
}

export default async function CoursePage({ params }: PageProps<"/learn/[course]">) {
  const { course: courseSlug } = await params;
  const user = await requireUser(`/learn/${courseSlug}`);

  const course = await getCourseBySlug(courseSlug);
  if (!course) notFound();

  const [completed, allProgress] = await Promise.all([
    getCompletedLessonIds(user.id),
    getCourseProgress(user.id),
  ]);

  const progress = allProgress.find((p) => p.courseId === course.id);
  const percent = progress?.percent ?? 0;

  const lessons: CourseLesson[] = course.lessons.map((lesson) => ({
    ...lesson,
    completed: completed.has(lesson.id),
  }));

  const firstIncomplete = lessons.find((l) => !l.completed) ?? lessons[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground">
          Learn
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{course.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* ------------------------------ Main ------------------------------ */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-start gap-4">
              <TrackIcon track={course.track} icon={course.icon} size="lg" />
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                  {course.title}
                </h1>
                <p className="mt-1 text-muted-foreground">{course.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <DifficultyBadge difficulty={course.difficulty} />
                  <Badge tone="neutral">
                    {course.lessons.length} lessons
                  </Badge>
                  <Badge tone="neutral">
                    {course.lessons.filter((l) => l.isProject).length > 0
                      ? "Includes a project"
                      : "Lessons + exercises"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Your progress</span>
                <span className="font-semibold tabular-nums">{percent}%</span>
              </div>
              <Progress
                value={percent}
                label={`${course.title} progress`}
                className={percent === 100 ? "[&>div]:bg-success" : undefined}
              />
              <p className="text-xs text-muted-foreground">
                {progress?.completed ?? 0} of {progress?.total ?? course.lessons.length} lessons
                complete
              </p>
            </div>

            {firstIncomplete && (
              <Button asChild size="lg" className="mt-5 w-full sm:w-auto">
                <Link href={`/learn/${course.slug}/${firstIncomplete.slug}`}>
                  {percent > 0 ? "Continue course" : "Start the first lesson"}
                  <ArrowRight />
                </Link>
              </Button>
            )}
          </Card>

          {/* -------------------------- Lesson list -------------------------- */}
          <div>
            <h2 className="mb-3 text-lg font-semibold">Course content</h2>
            <ol className="space-y-2">
              {lessons.map((lesson, index) => (
                <li key={lesson.id}>
                  <Link
                    href={`/learn/${course.slug}/${lesson.slug}`}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                        lesson.completed
                          ? "bg-success-soft text-success"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 font-medium">
                        {lesson.title}
                        {lesson.isProject && (
                          <Badge tone="primary">
                            <FolderGit className="size-3" />
                            Project
                          </Badge>
                        )}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                        {lesson.summary}
                      </p>
                    </div>

                    <span className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
                      <Clock className="size-3.5" />
                      {lesson.estimatedMinutes} min
                    </span>

                    {lesson.completed ? (
                      <span className="sr-only">Completed</span>
                    ) : (
                      <Circle className="size-4 shrink-0 text-muted-foreground/40" />
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ----------------------------- Sidebar ----------------------------- */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <CourseSidebar
            courseSlug={course.slug}
            courseTitle={course.title}
            track={course.track}
            icon={course.icon}
            lessons={lessons}
            percent={percent}
          />

          <Card className="mt-4 p-5">
            <h3 className="text-sm font-semibold">About this course</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {course.tagline}. Work through the lessons in order — each one builds on the
              last — and finish with the project to put it all together.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
