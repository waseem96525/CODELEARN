import type { Metadata } from "next";
import {
  Activity,
  Award,
  BookOpen,
  FolderGit2,
  Layers,
  Swords,
  Users,
  Zap,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/app-shell";
import { ActivityChart } from "@/components/activity-chart";
import { formatXp, formatDate, initialsOf } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin",
  description: "Platform analytics and user management.",
  robots: { index: false, follow: false },
};

const DAY = 86_400_000;

/** Report windows, computed once per request. */
function windows() {
  const now = Date.now();
  const weekAgo = new Date(now - 7 * DAY);
  return {
    since: new Date(now - 30 * DAY),
    weekAgo,
    weekAgoDay: weekAgo.toISOString().slice(0, 10),
  };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const { q } = await searchParams;
  const { since, weekAgo, weekAgoDay } = windows();

  const [
    users,
    newThisWeek,
    activeThisWeek,
    admins,
    courses,
    lessons,
    challenges,
    projects,
    completions,
    submissions,
    certificates,
    xpAggregate,
    contentRows,
    topLearners,
    recentUsers,
    activityRows,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.dailyActivity.findMany({
      where: { date: { gte: weekAgoDay } },
      select: { userId: true },
      distinct: ["userId"],
    }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.course.count({ where: { published: true } }),
    prisma.lesson.count({ where: { published: true } }),
    prisma.challenge.count({ where: { published: true } }),
    prisma.project.count({ where: { published: true } }),
    prisma.userProgress.count({ where: { completed: true } }),
    prisma.challengeSubmission.count({ where: { passed: true } }),
    prisma.certificate.count(),
    prisma.user.aggregate({ where: { createdAt: { gte: since } }, _sum: { xp: true } }),
    prisma.course.findMany({
      where: { published: true },
      orderBy: { orderIndex: "asc" },
      select: {
        id: true,
        title: true,
        track: true,
        _count: { select: { lessons: true, progress: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { xp: "desc" },
      take: 8,
      select: { id: true, name: true, email: true, xp: true, level: true, streak: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, email: true, createdAt: true, onboardingDone: true },
    }),
    prisma.dailyActivity.findMany({
      orderBy: { date: "asc" },
      take: 7,
      select: { date: true, xpEarned: true, secondsLearned: true },
    }),
  ]);

  const search = q?.trim();
  const matches = search
    ? await prisma.user.findMany({
        where: {
          OR: [{ name: { contains: search } }, { email: { contains: search } }],
        },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          xp: true,
          level: true,
          streak: true,
          emailVerified: true,
          createdAt: true,
        },
      })
    : null;

  const activity = activityRows.map((row) => ({
    date: row.date,
    label: new Date(`${row.date}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short" }),
    xp: row.xpEarned,
    minutes: Math.round(row.secondsLearned / 60),
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader title="Admin" description="Platform health, content inventory and learners.">
        <Badge tone="danger">Admin only</Badge>
      </PageHeader>

      {/* ------------------------------ Platform ------------------------------ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Learners"
          value={users}
          sublabel={`${newThisWeek} joined this week · ${admins} admin(s)`}
          icon={<Users className="size-4" />}
        />
        <StatCard
          label="Active this week"
          value={activeThisWeek.length}
          sublabel="At least one recorded activity"
          icon={<Activity className="size-4" />}
          tone="success"
        />
        <StatCard
          label="XP awarded (30 days)"
          value={formatXp(xpAggregate._sum.xp ?? 0)}
          sublabel="Across all learners"
          icon={<Zap className="size-4" />}
          tone="warning"
        />
        <StatCard
          label="Certificates issued"
          value={certificates}
          sublabel="Learning paths completed"
          icon={<Award className="size-4" />}
          tone="info"
        />
      </div>

      {/* ------------------------------ Content ------------------------------ */}
      <Card className="p-5">
        <h2 className="font-semibold">Content</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Courses", value: courses, icon: <BookOpen className="size-4" /> },
            { label: "Lessons", value: lessons, icon: <Layers className="size-4" /> },
            { label: "Challenges", value: challenges, icon: <Swords className="size-4" /> },
            { label: "Projects", value: projects, icon: <FolderGit2 className="size-4" /> },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {item.icon}
                {item.label}
              </div>
              <p className="mt-1 text-2xl font-bold tabular-nums">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2">
          <p className="text-sm font-semibold">Lessons completed per course</p>
          {contentRows.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-2.5"
            >
              <span className="min-w-0 truncate text-sm">{course.title}</span>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {course._count.lessons} lessons · {course._count.progress} completions
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Lesson completions</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{completions}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Challenge passes</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{submissions}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Lessons per course (avg)</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {courses === 0 ? 0 : Math.round(lessons / courses)}
            </p>
          </div>
        </div>
      </Card>

      {/* ------------------------------ Activity ------------------------------ */}
      <Card className="p-5">
        <h2 className="font-semibold">XP earned (last 7 recorded days)</h2>
        {activity.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <div className="mt-4">
            <ActivityChart data={activity} />
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* --------------------------- Top learners --------------------------- */}
        <Card className="p-5">
          <h2 className="font-semibold">Top learners</h2>
          <ul className="mt-3 divide-y divide-border">
            {topLearners.map((learner, index) => (
              <li key={learner.id} className="flex items-center gap-3 py-2.5">
                <span className="w-5 text-sm font-bold tabular-nums text-muted-foreground">
                  {index + 1}
                </span>
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                >
                  {initialsOf(learner.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{learner.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {learner.email}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-semibold tabular-nums">
                    {formatXp(learner.xp)} XP
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Lv {learner.level} · {learner.streak}d
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* --------------------------- New learners --------------------------- */}
        <Card className="p-5">
          <h2 className="font-semibold">Newest accounts</h2>
          <ul className="mt-3 divide-y divide-border">
            {recentUsers.map((record) => (
              <li key={record.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{record.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {record.email}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {!record.onboardingDone && <Badge tone="warning">Onboarding</Badge>}
                  <span className="text-xs text-muted-foreground">
                    {formatDate(record.createdAt)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ------------------------------- Search ------------------------------- */}
      <Card className="p-5">
        <h2 className="font-semibold">Find a learner</h2>
        <form method="get" className="mt-3 flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={search ?? ""}
            placeholder="Name or email"
            aria-label="Search learners"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Search
          </button>
        </form>

        {matches && (
          <ul className="mt-4 divide-y divide-border">
            {matches.length === 0 && (
              <li className="py-3 text-sm text-muted-foreground">No accounts match that.</li>
            )}
            {matches.map((record) => (
              <li key={record.id} className="flex flex-wrap items-center gap-3 py-2.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{record.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {record.email}
                  </span>
                </span>
                <Badge tone={record.role === "ADMIN" ? "danger" : "neutral"}>{record.role}</Badge>
                {!record.emailVerified && <Badge tone="warning">Unverified</Badge>}
                <span className="text-xs tabular-nums text-muted-foreground">
                  {formatXp(record.xp)} XP · Lv {record.level} · joined{" "}
                  {formatDate(record.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
