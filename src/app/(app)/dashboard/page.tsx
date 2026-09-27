import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  FolderGit2,
  Swords,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { LEVELS } from "@/lib/gamification";
import {
  getCourseProgress,
  getDashboardStats,
  getNextLesson,
  getRecentActivity,
  getChallenges,
  getPassedChallengeIds,
  getProjects,
} from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard, ContinueCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { TrackIcon, TrackChip } from "@/components/track-icon";
import { ActivityChart } from "@/components/activity-chart";
import { formatXp, greeting } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  if (!user.onboardingDone) redirect("/onboarding");

  const [stats, next, courseProgress, activity, challenges, passed, projects, userProjects] =
    await Promise.all([
      getDashboardStats(user.id),
      getNextLesson(user.id),
      getCourseProgress(user.id),
      getRecentActivity(user.id),
      getChallenges(),
      getPassedChallengeIds(user.id),
      getProjects(),
      prisma.userProject.findMany({
        where: { userId: user.id },
        select: { id: true, completed: true },
      }),
    ]);

  const currentCourse = next
    ? courseProgress.find((c) => c.slug === next.courseSlug)
    : undefined;

  const completedProjectSlugs = new Set(
    userProjects.filter((p) => p.completed).map((p) => p.id),
  );
  const nextChallenge = challenges.find((c) => !passed.has(c.id));
  const firstName = user.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
      {/* ----------------------------- Greeting ----------------------------- */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            {greeting()}, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {stats.goalMet
              ? "Daily goal complete. Anything else today is a bonus."
              : `You are ${stats.goalMinutes - stats.minutesToday} minutes away from today's goal.`}
          </p>
        </div>
        <LevelSummary xp={stats.xp} level={stats.level} levelName={stats.levelName} progress={stats.levelProgress} />
      </div>

      {/* --------------------------- Continue card --------------------------- */}
      {next && currentCourse ? (
        <ContinueCard
          courseTitle={next.courseTitle}
          track={next.track}
          progress={currentCourse.percent}
          lessonTitle={next.lessonTitle}
          lessonHref={`/learn/${next.courseSlug}/${next.lessonSlug}`}
          minutes={next.minutes}
        />
      ) : (
        <EmptyState
          icon={<CheckCircle2 className="size-5" />}
          title="Every lesson complete"
          description="You have finished all the course content. Try a coding challenge or build a project next."
          action="Browse challenges"
          actionHref="/practice"
        />
      )}

      {/* ------------------------------ Stats ------------------------------ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Learning streak"
          value={
            <span className="flex items-center gap-1.5">
              <Flame className="size-5 text-warning" />
              {stats.streak}
            </span>
          }
          sublabel={
            stats.longestStreak > 0
              ? `Personal best: ${stats.longestStreak} days`
              : "Complete one activity today"
          }
          icon={<Flame className="size-4" />}
          tone="warning"
          href="/profile"
        />
        <StatCard
          label="Total XP"
          value={formatXp(stats.xp)}
          sublabel={`Level ${stats.level} — ${stats.levelName}`}
          icon={<Zap className="size-4" />}
          href="/profile"
        />
        <StatCard
          label="Badges earned"
          value={stats.badges}
          sublabel="Unlock more as you progress"
          icon={<Award className="size-4" />}
          tone="success"
          href="/achievements"
        />
        <StatCard
          label="Time studied"
          value={`${stats.hoursLearned}h`}
          sublabel="Total across all lessons"
          icon={<Clock className="size-4" />}
          tone="info"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ------------------------- Daily goal ------------------------- */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-4 text-primary" />
              Today&apos;s goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tabular-nums">{stats.minutesToday}</span>
              <span className="text-muted-foreground">/ {stats.goalMinutes} minutes</span>
            </div>
            <Progress value={stats.goalPercent} label="Daily goal progress" />
            <p className="text-xs text-muted-foreground">
              {stats.goalMet
                ? "Goal met. Come back tomorrow to keep your streak."
                : `About ${Math.max(1, Math.round((stats.goalMinutes - stats.minutesToday) * 1.5))} minutes of study to go.`}
            </p>
            <Button asChild size="sm" variant={stats.goalMet ? "outline" : "primary"} className="w-full">
              <Link href="/learn">
                <BookOpen />
                {stats.goalMet ? "Keep learning" : "Study now"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* ------------------------- Course progress ------------------------- */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your courses</span>
              <Link
                href="/learn"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseProgress.map((course) => (
              <Link
                key={course.courseId}
                href={`/learn/${course.slug}`}
                className="block space-y-1.5 rounded-lg p-2 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <TrackIcon track={course.track} size="sm" />
                    <span className="text-sm font-medium">{course.title}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{course.percent}%</span>
                </div>
                <Progress
                  value={course.percent}
                  label={`${course.title} progress`}
                  className={course.percent === 100 ? "[&>div]:bg-success" : undefined}
                />
                <p className="text-xs text-muted-foreground">
                  {course.completed} of {course.total} lessons
                  {course.percent === 100 && (
                    <span className="ml-2 font-medium text-success">Complete</span>
                  )}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ------------------------- Weekly activity ------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Last 7 days</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityChart data={activity} />
        </CardContent>
      </Card>

      {/* ------------------------- Next up cards ------------------------- */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col justify-between p-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Swords className="size-4 text-primary" />
              <h3 className="font-semibold">Next challenge</h3>
            </div>
            {nextChallenge ? (
              <>
                <p className="text-sm font-medium">{nextChallenge.title}</p>
                <p className="text-xs text-muted-foreground">
                  {nextChallenge.difficulty.toLowerCase()} &middot; {nextChallenge.xpReward} XP
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                You have passed every challenge. Impressive.
              </p>
            )}
          </div>
          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link href={nextChallenge ? `/practice/${nextChallenge.slug}` : "/practice"}>
              {nextChallenge ? "Solve it" : "View all"}
              <ChevronRight />
            </Link>
          </Button>
        </Card>

        <Card className="flex flex-col justify-between p-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FolderGit2 className="size-4 text-primary" />
              <h3 className="font-semibold">Next project</h3>
            </div>
            {projects[0] ? (
              <>
                <p className="text-sm font-medium">{projects[0].title}</p>
                <p className="text-xs text-muted-foreground">
                  {projects[0].xpReward} XP &middot;{" "}
                  {completedProjectSlugs.size}/{projects.length} completed
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            )}
          </div>
          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link href="/projects">
              Build it
              <ChevronRight />
            </Link>
          </Button>
        </Card>

        <Card className="flex flex-col justify-between p-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-primary" />
              <h3 className="font-semibold">Next level</h3>
            </div>
            {stats.xpToNext ? (
              <>
                <p className="text-sm font-medium">
                  {formatXp(stats.xpToNext)} XP to Level {stats.level + 1}
                </p>
                <p className="text-xs text-muted-foreground">
                  Currently {LEVELS.find((l) => l.level === stats.level + 1)?.name ?? "the top level"}
                </p>
              </>
            ) : (
              <p className="text-sm text-medium">You have reached the highest level.</p>
            )}
          </div>
          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link href="/profile">
              See progress
              <ChevronRight />
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}

function LevelSummary({
  xp,
  level,
  levelName,
  progress,
}: {
  xp: number;
  level: number;
  levelName: string;
  progress: number;
}) {
  return (
    <Card className="w-full max-w-xs p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Level {level}
          </p>
          <p className="text-lg font-bold leading-tight">{levelName}</p>
        </div>
        <Badge tone="primary">{formatXp(xp)} XP</Badge>
      </div>
      <Progress value={progress} label="Level progress" className="mt-3" />
    </Card>
  );
}
