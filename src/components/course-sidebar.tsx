"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, Circle, FolderGit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { TrackIcon } from "@/components/track-icon";

export interface CourseLesson {
  id: string;
  title: string;
  slug: string;
  summary: string;
  orderIndex: number;
  estimatedMinutes: number;
  difficulty: string;
  isProject: boolean;
  completed: boolean;
}

/**
 * Course navigation sidebar.
 *
 * Rendered client-side only for the active-state highlighting; the surrounding
 * layout and the lesson list itself come from the server, so this is progressive
 * enhancement rather than a second source of truth.
 */
export function CourseSidebar({
  courseSlug,
  courseTitle,
  track,
  icon,
  lessons,
  percent,
}: {
  courseSlug: string;
  courseTitle: string;
  track: string;
  icon: string | null;
  lessons: CourseLesson[];
  percent: number;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Course lessons"
      className="max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-border bg-card shadow-card"
    >
      <div className="sticky top-0 space-y-2 border-b border-border bg-card p-4">
        <div className="flex items-center gap-2.5">
          <TrackIcon track={track} icon={icon} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{courseTitle}</p>
            <p className="text-xs text-muted-foreground">{percent}% complete</p>
          </div>
        </div>
        <Progress value={percent} label="Course progress" />
      </div>

      <ol className="p-2">
        {lessons.map((lesson, index) => {
          const href = `/learn/${courseSlug}/${lesson.slug}`;
          const active = pathname === href;

          return (
            <li key={lesson.id}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary-soft font-semibold text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="mt-0.5 shrink-0">
                  {lesson.completed ? (
                    <CheckCircle2 className="size-4 text-success" />
                  ) : active ? (
                    <Circle className="size-4 fill-current" />
                  ) : (
                    <span className="block w-4 text-center text-xs tabular-nums text-muted-foreground/70">
                      {index + 1}
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    {lesson.title}
                    {lesson.isProject && <FolderGit className="size-3 shrink-0" />}
                  </span>
                  <span className="mt-0.5 block text-xs opacity-70">
                    {lesson.estimatedMinutes} min
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
