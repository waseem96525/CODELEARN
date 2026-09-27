import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getTodayActivity, getLevelInfo, utcDay } from "@/lib/gamification";
import { fromJson } from "@/lib/json";
import type { CodeFiles, LessonContent, ValidationTest } from "@/lib/types";

// ---------------------------------------------------------------------------
// Content reads (public / cached)
// ---------------------------------------------------------------------------

export const getCourses = cache(async () =>
  prisma.course.findMany({
    where: { published: true },
    orderBy: { orderIndex: "asc" },
    include: { _count: { select: { lessons: { where: { published: true } } } } },
  }),
);

export const getCourseBySlug = cache(async (slug: string) =>
  prisma.course.findFirst({
    where: { slug, published: true },
    include: {
      lessons: {
        where: { published: true },
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          orderIndex: true,
          estimatedMinutes: true,
          difficulty: true,
          isProject: true,
        },
      },
    },
  }),
);

export const getLessonByCourseAndSlug = cache(async (courseSlug: string, lessonSlug: string) => {
  const course = await prisma.course.findFirst({
    where: { slug: courseSlug, published: true },
    select: { id: true, title: true, slug: true, track: true, icon: true },
  });
  if (!course) return null;

  const lesson = await prisma.lesson.findFirst({
    where: { courseId: course.id, slug: lessonSlug, published: true },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
        include: { options: { orderBy: { orderIndex: "asc" } } },
      },
    },
  });
  if (!lesson) return null;

  return { course, lesson };
});

export function parseLessonContent(raw: string): LessonContent {
  return fromJson<LessonContent>(raw, { objective: "", blocks: [] });
}

// ---------------------------------------------------------------------------
// Progress reads
// ---------------------------------------------------------------------------

/** Every completed lesson for a user, as a Set of lesson ids. */
export const getCompletedLessonIds = cache(async (userId: string): Promise<Set<string>> => {
  const rows = await prisma.userProgress.findMany({
    where: { userId, completed: true },
    select: { lessonId: true },
  });
  return new Set(rows.map((r) => r.lessonId));
});

export interface CourseProgress {
  courseId: string;
  slug: string;
  title: string;
  track: string;
  total: number;
  completed: number;
  percent: number;
}

export const getCourseProgress = cache(
  async (userId: string): Promise<CourseProgress[]> => {
    const [courses, done] = await Promise.all([
      getCourses(),
      getCompletedLessonIds(userId),
    ]);

    if (courses.length === 0) return [];

    const rows = await prisma.lesson.findMany({
      where: { courseId: { in: courses.map((c) => c.id) }, published: true },
      select: { id: true, courseId: true },
    });

    const byCourse = new Map<string, number>();
    for (const row of rows) {
      if (done.has(row.id)) byCourse.set(row.courseId, (byCourse.get(row.courseId) ?? 0) + 1);
    }

    return courses.map((course) => {
      const total = rows.filter((r) => r.courseId === course.id).length;
      const completed = byCourse.get(course.id) ?? 0;
      return {
        courseId: course.id,
        slug: course.slug,
        title: course.title,
        track: course.track,
        total,
        completed,
        percent: total === 0 ? 0 : Math.round((completed / total) * 100),
      };
    });
  },
);

export interface NextLesson {
  courseSlug: string;
  courseTitle: string;
  track: string;
  lessonSlug: string;
  lessonTitle: string;
  minutes: number;
}

/** The first not-yet-completed lesson of the first course with progress. */
export const getNextLesson = cache(async (userId: string): Promise<NextLesson | null> => {
  const done = await getCompletedLessonIds(userId);

  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { orderIndex: "asc" },
    include: {
      lessons: {
        where: { published: true },
        orderBy: { orderIndex: "asc" },
        select: { id: true, title: true, slug: true, estimatedMinutes: true },
      },
    },
  });

  for (const course of courses) {
    const next = course.lessons.find((l) => !done.has(l.id));
    if (next) {
      return {
        courseSlug: course.slug,
        courseTitle: course.title,
        track: course.track,
        lessonSlug: next.slug,
        lessonTitle: next.title,
        minutes: next.estimatedMinutes,
      };
    }
  }

  // Everything in every course is done — send them to the project lesson.
  const last = courses.at(-1);
  const lesson = last?.lessons.at(-1);
  if (last && lesson) {
    return {
      courseSlug: last.slug,
      courseTitle: last.title,
      track: last.track,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
      minutes: lesson.estimatedMinutes,
    };
  }
  return null;
});

// ---------------------------------------------------------------------------
// Learning paths
// ---------------------------------------------------------------------------

export interface PathStage {
  courseId: string;
  slug: string;
  title: string;
  track: string;
  description: string;
  difficulty: string;
  total: number;
  completed: number;
  percent: number;
}

export interface LearningPathSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  emoji: string;
  tier: string;
  stages: PathStage[];
  total: number;
  completed: number;
  percent: number;
}

/**
 * Every learning path with each stage's lesson counts, annotated with the
 * signed-in user's progress. `getCourseProgress` already knows the per-course
 * numbers, so it is reused rather than re-queried.
 */
export const getLearningPaths = cache(
  async (userId: string): Promise<LearningPathSummary[]> => {
    const [paths, progress] = await Promise.all([
      prisma.learningPath.findMany({
        orderBy: { title: "asc" },
        include: {
          stages: {
            orderBy: { orderIndex: "asc" },
            include: {
              course: {
                select: {
                  id: true,
                  slug: true,
                  title: true,
                  track: true,
                  description: true,
                  difficulty: true,
                  published: true,
                  _count: { select: { lessons: { where: { published: true } } } },
                },
              },
            },
          },
        },
      }),
      getCourseProgress(userId),
    ]);

    const byCourse = new Map(progress.map((p) => [p.courseId, p]));

    return paths.map((path) => {
      const stages: PathStage[] = path.stages
        .filter((s) => s.course.published)
        .map((s) => {
          const mine = byCourse.get(s.course.id);
          const total = mine?.total ?? s.course._count.lessons;
          const completed = mine?.completed ?? 0;
          return {
            courseId: s.course.id,
            slug: s.course.slug,
            title: s.course.title,
            track: s.course.track,
            description: s.course.description,
            difficulty: s.course.difficulty,
            total,
            completed,
            percent: total === 0 ? 0 : Math.round((completed / total) * 100),
          };
        });

      const total = stages.reduce((sum, s) => sum + s.total, 0);
      const completed = stages.reduce((sum, s) => sum + s.completed, 0);

      return {
        id: path.id,
        slug: path.slug,
        title: path.title,
        description: path.description,
        emoji: path.emoji,
        tier: path.tier,
        stages,
        total,
        completed,
        percent: total === 0 ? 0 : Math.round((completed / total) * 100),
      };
    });
  },
);

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export interface DashboardStats {
  xp: number;
  level: number;
  levelName: string;
  levelProgress: number;
  xpToNext: number | null;
  streak: number;
  longestStreak: number;
  lessonsCompleted: number;
  challengesCompleted: number;
  projectsCompleted: number;
  badges: number;
  minutesToday: number;
  goalMinutes: number;
  goalPercent: number;
  goalMet: boolean;
  hoursLearned: number;
}

export const getDashboardStats = cache(async (userId: string): Promise<DashboardStats> => {
  const [user, activity, progress, challenges, projects, badges, seconds] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        xp: true,
        level: true,
        streak: true,
        longestStreak: true,
        dailyGoalMinutes: true,
      },
    }),
    getTodayActivity(userId),
    prisma.userProgress.count({ where: { userId, completed: true } }),
    prisma.challengeSubmission.groupBy({
      by: ["challengeId"],
      where: { userId, passed: true },
    }),
    prisma.userProject.count({ where: { userId, completed: true } }),
    prisma.userAchievement.count({ where: { userId } }),
    prisma.dailyActivity.aggregate({
      where: { userId },
      _sum: { secondsLearned: true },
    }),
  ]);

  const info = getLevelInfo(user.xp);
  const goalMinutes = user.dailyGoalMinutes;
  const minutesToday = Math.round(activity.secondsLearned / 60);

  return {
    xp: user.xp,
    level: user.level,
    levelName: info.name,
    levelProgress: info.progress,
    xpToNext: info.xpForNextLevel,
    streak: user.streak,
    longestStreak: user.longestStreak,
    lessonsCompleted: progress,
    challengesCompleted: challenges.length,
    projectsCompleted: projects,
    badges,
    minutesToday,
    goalMinutes,
    goalPercent: Math.min(100, Math.round((minutesToday / goalMinutes) * 100)),
    goalMet: activity.goalMet,
    hoursLearned: Math.round(((seconds._sum.secondsLearned ?? 0) / 3600) * 10) / 10,
  };
});

/** Last 7 days of activity, oldest first, for the dashboard chart. */
export const getRecentActivity = cache(async (userId: string) => {
  const days: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    days.push(new Date(today.getTime() - i * 86_400_000).toISOString().slice(0, 10));
  }

  const rows = await prisma.dailyActivity.findMany({
    where: { userId, date: { in: days } },
    select: { date: true, xpEarned: true, secondsLearned: true },
  });

  const byDate = new Map(rows.map((r) => [r.date, r]));
  return days.map((date) => ({
    date,
    label: new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short" }),
    xp: byDate.get(date)?.xpEarned ?? 0,
    minutes: Math.round((byDate.get(date)?.secondsLearned ?? 0) / 60),
  }));
});

// ---------------------------------------------------------------------------
// Challenges and projects
// ---------------------------------------------------------------------------

export const getChallenges = cache(async () =>
  prisma.challenge.findMany({ where: { published: true }, orderBy: { orderIndex: "asc" } }),
);

export const getChallengeBySlug = cache(async (slug: string) =>
  prisma.challenge.findFirst({ where: { slug, published: true } }),
);

/** Challenge ids the user has passed at least once. */
export const getPassedChallengeIds = cache(async (userId: string): Promise<Set<string>> => {
  const rows = await prisma.challengeSubmission.findMany({
    where: { userId, passed: true },
    select: { challengeId: true },
    distinct: ["challengeId"],
  });
  return new Set(rows.map((r) => r.challengeId));
});

export const getProjects = cache(async () =>
  prisma.project.findMany({ where: { published: true }, orderBy: { orderIndex: "asc" } }),
);

export const getProjectBySlug = cache(async (slug: string) =>
  prisma.project.findFirst({ where: { slug, published: true } }),
);

export const getUserProjects = cache(async (userId: string) =>
  prisma.userProject.findMany({
    where: { userId },
    include: { project: { select: { title: true, slug: true, difficulty: true, track: true } } },
    orderBy: { updatedAt: "desc" },
  }),
);

// ---------------------------------------------------------------------------
// Bookmarks and notes
// ---------------------------------------------------------------------------

export interface BookmarkEntry {
  id: string;
  contentType: string;
  contentId: string;
  createdAt: Date;
  title: string;
  href: string;
  detail: string;
  track: string | null;
  available: boolean;
}

/**
 * A user's bookmarks flattened into one list. Each type is joined separately
 * because a bookmark row points at three different tables; anything that has
 * since been unpublished is returned with `available: false` rather than
 * dropped, so a stale bookmark is visible instead of silently vanishing.
 */
export const getBookmarks = cache(async (userId: string): Promise<BookmarkEntry[]> => {
  const rows = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      lesson: { select: { id: true, title: true, slug: true, published: true, course: { select: { slug: true, track: true } } } },
      challenge: { select: { id: true, title: true, slug: true, published: true, track: true } },
      project: { select: { id: true, title: true, slug: true, published: true, track: true } },
    },
  });

  return rows.map((row) => {
    if (row.lesson) {
      return {
        id: row.id,
        contentType: row.contentType,
        contentId: row.contentId,
        createdAt: row.createdAt,
        title: row.lesson.title,
        href: `/learn/${row.lesson.course.slug}/${row.lesson.slug}`,
        detail: "Lesson",
        track: row.lesson.course.track,
        available: row.lesson.published,
      };
    }
    if (row.challenge) {
      return {
        id: row.id,
        contentType: row.contentType,
        contentId: row.contentId,
        createdAt: row.createdAt,
        title: row.challenge.title,
        href: `/practice/${row.challenge.slug}`,
        detail: "Challenge",
        track: row.challenge.track,
        available: row.challenge.published,
      };
    }
    if (row.project) {
      return {
        id: row.id,
        contentType: row.contentType,
        contentId: row.contentId,
        createdAt: row.createdAt,
        title: row.project.title,
        href: `/projects/${row.project.slug}`,
        detail: "Project",
        track: row.project.track,
        available: row.project.published,
      };
    }
    return {
      id: row.id,
      contentType: row.contentType,
      contentId: row.contentId,
      createdAt: row.createdAt,
      title: "Removed content",
      href: "#",
      detail: row.contentType,
      track: null,
      available: false,
    };
  });
});

export const getNotes = cache(async (userId: string) =>
  prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      lesson: {
        select: {
          title: true,
          slug: true,
          course: { select: { slug: true, title: true, track: true } },
        },
      },
    },
  }),
);

export interface AchievementStats {
  lessonsCompleted: number;
  lessonsByTrack: Record<string, number>;
  coursesCompletedByTrack: Record<string, number>;
  challengesCompleted: number;
  challengesByTrack: Record<string, number>;
  projectsCompleted: number;
  streak: number;
  perfectQuizzes: number;
  xp: number;
  bookmarks: number;
  notes: number;
  activeDays: number;
}

/** The counters an achievement's criteria can be measured against. */
export const getAchievementStats = cache(async (userId: string): Promise<AchievementStats> => {
  const [user, lessons, courses, challenges, projects, perCourse, perfect, bookmarks, notes, days] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { xp: true, longestStreak: true } }),
      prisma.userProgress.findMany({
        where: { userId, completed: true },
        select: { course: { select: { track: true } } },
      }),
      prisma.course.findMany({
        select: {
          id: true,
          track: true,
          _count: { select: { lessons: { where: { published: true } } } },
        },
      }),
      prisma.challengeSubmission.findMany({
        where: { userId, passed: true },
        select: { challengeId: true, challenge: { select: { track: true } } },
        distinct: ["challengeId"],
      }),
      prisma.userProject.count({ where: { userId, completed: true } }),
      prisma.userProgress.groupBy({
        by: ["courseId"],
        where: { userId, completed: true },
        _count: { courseId: true },
      }),
      prisma.quizAttempt.findMany({
        where: { userId, correct: true },
        select: { questionId: true },
        distinct: ["questionId"],
      }),
      prisma.bookmark.count({ where: { userId } }),
      prisma.note.count({ where: { userId } }),
      prisma.dailyActivity.findMany({
        where: { userId, activitiesCount: { gt: 0 } },
        select: { date: true },
      }),
    ]);

  const lessonsByTrack: Record<string, number> = {};
  for (const row of lessons) {
    lessonsByTrack[row.course.track] = (lessonsByTrack[row.course.track] ?? 0) + 1;
  }

  // A course counts as complete only when every one of its lessons is done.
  const doneByCourse = new Map(perCourse.map((row) => [row.courseId, row._count.courseId]));
  const coursesCompletedByTrack: Record<string, number> = {};
  for (const course of courses) {
    if (course._count.lessons === 0) continue;
    if ((doneByCourse.get(course.id) ?? 0) >= course._count.lessons) {
      coursesCompletedByTrack[course.track] = (coursesCompletedByTrack[course.track] ?? 0) + 1;
    }
  }

  const challengesByTrack: Record<string, number> = {};
  for (const row of challenges) {
    challengesByTrack[row.challenge.track] = (challengesByTrack[row.challenge.track] ?? 0) + 1;
  }

  return {
    lessonsCompleted: lessons.length,
    lessonsByTrack,
    coursesCompletedByTrack,
    challengesCompleted: challenges.length,
    challengesByTrack,
    projectsCompleted: projects,
    streak: user?.longestStreak ?? 0,
    perfectQuizzes: perfect.length,
    xp: user?.xp ?? 0,
    bookmarks,
    notes,
    activeDays: days.length,
  };
});

export function parseFiles<T>(raw: string, fallback: T): T {
  return fromJson<T>(raw, fallback);
}

export function parseTests(raw: string): ValidationTest[] {
  return fromJson<ValidationTest[]>(raw, []);
}

export function parseCodeFiles(raw: string): CodeFiles {
  return fromJson<CodeFiles>(raw, { html: "", css: "", js: "" });
}

export { utcDay };
