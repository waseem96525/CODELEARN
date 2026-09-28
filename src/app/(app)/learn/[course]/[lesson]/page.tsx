import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2, Clock, NotebookPen, Share2 } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  getCompletedLessonIds,
  getCourseBySlug,
  getLessonByCourseAndSlug,
  parseLessonContent,
} from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { CourseSidebar, type CourseLesson } from "@/components/course-sidebar";
import { LessonContent } from "@/components/lesson-content";
import { Quiz, type QuizQuestionData } from "@/components/quiz";
import { LessonActions, LessonBookmarkButton } from "@/components/lesson-actions";
import { LessonNotes } from "@/components/lesson-notes";
import { ShareButton } from "@/components/share-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}): Promise<Metadata> {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const result = await getLessonByCourseAndSlug(courseSlug, lessonSlug);
  if (!result) return { title: "Lesson not found" };

  const { course, lesson } = result;
  return {
    title: lesson.title,
    description: lesson.summary,
    alternates: { canonical: `/learn/${course.slug}/${lesson.slug}` },
    openGraph: {
      title: `${lesson.title} — ${course.title}`,
      description: lesson.summary,
      type: "article",
    },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const user = await requireUser(`/learn/${courseSlug}/${lessonSlug}`);

  const result = await getLessonByCourseAndSlug(courseSlug, lessonSlug);
  if (!result) notFound();

  const { course, lesson } = result;
  const content = parseLessonContent(lesson.content);

  const [courseRow, completed, bookmark, notes] = await Promise.all([
    getCourseBySlug(courseSlug),
    getCompletedLessonIds(user.id),
    prisma.bookmark.findUnique({
      where: {
        userId_contentType_contentId: {
          userId: user.id,
          contentType: "LESSON",
          contentId: lesson.id,
        },
      },
    }),
    prisma.note.findMany({
      where: { userId: user.id, lessonId: lesson.id },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  if (!courseRow) notFound();

  const sidebarLessons: CourseLesson[] = courseRow.lessons.map((l) => ({
    ...l,
    completed: completed.has(l.id),
  }));

  const index = sidebarLessons.findIndex((l) => l.id === lesson.id);
  const previous = index > 0 ? sidebarLessons[index - 1] : null;
  const next = index < sidebarLessons.length - 1 ? sidebarLessons[index + 1] : null;

  const questions: QuizQuestionData[] = lesson.questions.map((q) => ({
    id: q.id,
    question: q.question,
    type: q.type as QuizQuestionData["type"],
    code: q.code,
    explanation: q.explanation,
    xpReward: q.xpReward,
    // isCorrect is deliberately NOT sent to the client. Grading happens on the
    // server, so shipping the answer key to the browser would defeat the point.
    options: q.options.map((o) => ({ id: o.id, optionText: o.optionText, isCorrect: false })),
  }));

  const isCompleted = completed.has(lesson.id);

  return (
    <div id="lesson-top" className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          {/* --------------------------- Lesson header --------------------------- */}
          <div className="space-y-3">
            <Link
              href={`/learn/${course.slug}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {course.title}
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">
                    Lesson {index + 1} of {sidebarLessons.length}
                  </Badge>
                  <DifficultyBadge difficulty={lesson.difficulty} />
                  {isCompleted && (
                    <Badge tone="success">
                      <CheckCircle2 className="size-3" />
                      Completed
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{lesson.title}</h1>
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4" />
                    {lesson.estimatedMinutes} minutes
                  </span>
                  <span>{lesson.difficulty.charAt(0) + lesson.difficulty.slice(1).toLowerCase()}</span>
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <LessonBookmarkButton
                  contentId={lesson.id}
                  initialBookmarked={Boolean(bookmark)}
                />
                <ShareButton title={lesson.title} />
              </div>
            </div>

            {content.objective && (
              <Card className="border-primary/30 bg-primary-soft/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Learning objective
                </p>
                <p className="mt-1.5 text-[15px] leading-7">{content.objective}</p>
              </Card>
            )}
          </div>

          {/* ------------------------------ Content ------------------------------ */}
          <LessonContent blocks={content.blocks} />

          {/* -------------------------------- Quiz -------------------------------- */}
          {questions.length > 0 && (
            <div className="border-t border-border pt-8">
              <Quiz lessonId={lesson.id} questions={questions} />
            </div>
          )}

          {/* ------------------------------- Notes ------------------------------- */}
          <div className="border-t border-border pt-8">
            <LessonNotes lessonId={lesson.id} initialNotes={notes} />
          </div>

          {/* ------------------------------ Complete ------------------------------ */}
          <LessonActions
            lessonId={lesson.id}
            courseSlug={course.slug}
            isCompleted={isCompleted}
            nextHref={next ? `/learn/${course.slug}/${next.slug}` : null}
            nextTitle={next?.title ?? null}
            courseCompleted={!next}
            courseName={course.title}
          />

          {/* ------------------------------ Prev/next ------------------------------ */}
          <nav className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
            {previous ? (
              <Link
                href={`/learn/${course.slug}/${previous.slug}`}
                className="group flex-1 rounded-xl border border-border p-4 transition-colors hover:border-primary/40"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowLeft className="size-3.5" />
                  Previous
                </span>
                <span className="mt-1 block font-medium group-hover:text-primary">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span className="flex-1" />
            )}

            {next && (
              <Link
                href={`/learn/${course.slug}/${next.slug}`}
                className="group flex-1 rounded-xl border border-border p-4 text-right transition-colors hover:border-primary/40"
              >
                <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                  Next
                  <ArrowRight className="size-3.5" />
                </span>
                <span className="mt-1 block font-medium group-hover:text-primary">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        </div>

        {/* ------------------------------ Sidebar ------------------------------ */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <CourseSidebar
            courseSlug={course.slug}
            courseTitle={course.title}
            track={course.track}
            icon={course.icon}
            lessons={sidebarLessons}
            percent={Math.round((sidebarLessons.filter((l) => l.completed).length / sidebarLessons.length) * 100)}
          />

          <Link
            href="/notes"
            className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-card p-4 text-sm font-medium transition-colors hover:border-primary/40"
          >
            <NotebookPen className="size-4 text-primary" />
            All your notes
          </Link>
        </div>
      </div>
    </div>
  );
}
