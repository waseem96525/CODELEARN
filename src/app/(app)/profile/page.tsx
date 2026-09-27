import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  FolderGit2,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { getDashboardStats, getUserProjects, getLearningPaths } from "@/lib/queries";
import { LEVELS } from "@/lib/gamification";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { ProfileForm } from "@/components/profile-form";
import { formatDate, formatXp, initialsOf } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your level, streak, portfolio and certificates.",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await requireUser("/profile");

  const [stats, record, projects, certificates, badgeCount, xpEvents, paths] = await Promise.all([
    getDashboardStats(user.id),
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        name: true,
        email: true,
        bio: true,
        createdAt: true,
        editorTheme: true,
      },
    }),
    getUserProjects(user.id),
    prisma.certificate.findMany({
      where: { userId: user.id },
      include: { path: { select: { title: true, emoji: true, slug: true } } },
      orderBy: { issuedAt: "desc" },
    }),
    prisma.userAchievement.count({ where: { userId: user.id } }),
    prisma.xpEvent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    getLearningPaths(user.id),
  ]);

  if (!record) return null;

  const completed = projects.filter((p) => p.completed);
  const level = LEVELS.find((l) => l.level === stats.level);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
      {/* ------------------------------ Identity ------------------------------ */}
      <Card className="p-6">
        <div className="flex flex-wrap items-start gap-5">
          <span
            aria-hidden
            className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-pop"
          >
            {initialsOf(record.name)}
          </span>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{record.name}</h1>
            <p className="text-sm text-muted-foreground">{record.email}</p>
            {record.bio && <p className="mt-2 max-w-2xl text-[15px]">{record.bio}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="primary">Level {stats.level}</Badge>
              <Badge tone="neutral">{level?.name ?? "Learner"}</Badge>
              <Badge tone="warning">
                <Flame className="size-3" />
                {stats.streak} day streak
              </Badge>
              <Badge tone="neutral">
                <CalendarDays className="size-3" />
                Joined {formatDate(record.createdAt)}
              </Badge>
            </div>

            <div className="mt-4 max-w-md space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatXp(stats.xp)} XP</span>
                <span>
                  {stats.xpToNext ? `${formatXp(stats.xpToNext)} to level ${stats.level + 1}` : "Max level"}
                </span>
              </div>
              <Progress value={stats.levelProgress} label="Level progress" />
            </div>
          </div>
        </div>
      </Card>

      {/* ------------------------------- Stats ------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Lessons completed"
          value={stats.lessonsCompleted}
          sublabel="Across every course"
          icon={<CheckCircle2 className="size-4" />}
          tone="success"
          href="/learn"
        />
        <StatCard
          label="Challenges passed"
          value={stats.challengesCompleted}
          sublabel="Tests green"
          icon={<Swords className="size-4" />}
          href="/practice"
        />
        <StatCard
          label="Projects shipped"
          value={stats.projectsCompleted}
          sublabel="In your portfolio"
          icon={<FolderGit2 className="size-4" />}
          href="/projects"
        />
        <StatCard
          label="Badges"
          value={badgeCount}
          sublabel={`Longest streak: ${stats.longestStreak} days`}
          icon={<Award className="size-4" />}
          tone="info"
          href="/achievements"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ---------------------------- Portfolio ---------------------------- */}
        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold">Portfolio</h2>
            <Link
              href="/projects"
              className="text-sm font-medium text-primary hover:underline"
            >
              Manage
            </Link>
          </div>

          {completed.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No finished projects yet. Your first one is the best way to prove you can build.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {completed.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/60"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{project.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {project.project.title}
                      </span>
                    </span>
                    <Trophy className="size-4 shrink-0 text-warning" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* -------------------------- Certificates -------------------------- */}
        <Card className="p-5">
          <h2 className="font-semibold">Certificates</h2>
          {certificates.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Finish every course in a learning path to earn a certificate.{" "}
              <Link href="/roadmap" className="font-medium text-primary hover:underline">
                See your roadmap
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {certificates.map((certificate) => (
                <li key={certificate.id}>
                  <Link
                    href={`/certificate/${certificate.serial}`}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/60"
                  >
                    <span aria-hidden className="text-2xl">
                      {certificate.path.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {certificate.path.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {certificate.serial} &middot; {formatDate(certificate.issuedAt)}
                      </span>
                    </span>
                    <Trophy className="size-4 shrink-0 text-warning" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* --------------------------- Path progress --------------------------- */}
      <Card className="p-5">
        <h2 className="font-semibold">Learning paths</h2>
        {paths.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No learning paths are published.</p>
        ) : (
          <ul className="mt-3 space-y-4">
            {paths.map((path) => (
              <li key={path.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">
                    <span aria-hidden className="mr-1.5">
                      {path.emoji}
                    </span>
                    {path.title}
                  </p>
                  <p className="text-xs tabular-nums text-muted-foreground">
                    {path.completed}/{path.total} lessons &middot; {path.percent}%
                  </p>
                </div>
                <Progress
                  value={path.percent}
                  label={`${path.title} progress`}
                  className="mt-1.5"
                />
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* ---------------------------- XP history ---------------------------- */}
      <Card className="p-5">
        <h2 className="font-semibold">Recent XP</h2>
        {xpEvents.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Complete a lesson to start earning XP.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {xpEvents.map((event) => (
              <li key={event.id} className="flex items-center gap-3 py-2.5">
                <Zap className="size-4 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate text-sm">
                  {event.note ?? event.reason}
                </span>
                <span className="text-xs text-muted-foreground">{event.reason}</span>
                <span
                  className={
                    event.amount >= 0
                      ? "text-sm font-semibold tabular-nums text-success"
                      : "text-sm font-semibold tabular-nums text-danger"
                  }
                >
                  {event.amount >= 0 ? "+" : ""}
                  {event.amount}
                </span>
                <span className="hidden w-24 text-right text-xs text-muted-foreground sm:block">
                  <Clock className="mr-1 inline size-3 align-text-bottom" />
                  {new Date(event.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ProfileForm
        values={{
          name: record.name,
          bio: record.bio ?? "",
          dailyGoalMinutes: user.dailyGoalMinutes,
          editorTheme:
            record.editorTheme === "light" || record.editorTheme === "dark"
              ? record.editorTheme
              : "system",
        }}
      />
    </div>
  );
}
