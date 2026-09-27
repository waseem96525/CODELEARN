import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, Compass, Lock, Trophy } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { getLearningPaths } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { TrackIcon } from "@/components/track-icon";
import { PageHeader } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Structured learning paths that order the courses for you.",
  robots: { index: false, follow: false },
};

export default async function RoadmapPage() {
  const user = await requireUser("/roadmap");

  const [paths, assigned] = await Promise.all([
    getLearningPaths(user.id),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { assignedPathId: true },
    }),
  ]);

  // The user's own path first, then everything else alphabetically.
  const ordered = [...paths].sort((a, b) => {
    if (a.id === assigned?.assignedPathId) return -1;
    if (b.id === assigned?.assignedPathId) return 1;
    return 0;
  });

  const assignedPath = ordered.find((p) => p.id === assigned?.assignedPathId);
  const certificates = await prisma.certificate.findMany({
    where: { userId: user.id },
    select: { serial: true, path: { select: { title: true, emoji: true } } },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader
        title="Roadmap"
        description="Follow a path to get an ordered plan — and a certificate when you finish it."
      />

      {ordered.length === 0 ? (
        <EmptyState
          icon={<Compass className="size-5" />}
          title="No learning paths yet"
          description="You can still browse every course from the Learn tab."
          action="Browse courses"
          actionHref="/learn"
        />
      ) : (
        <div className="space-y-6">
          {ordered.map((path) => {
            const isAssigned = path.id === assigned?.assignedPathId;
            const done = path.percent === 100;
            const firstIncomplete = path.stages.find((s) => s.percent < 100);
            const certificate = certificates.find((c) => c.path.title === path.title);

            return (
              <Card key={path.id} className="overflow-hidden">
                <div className="border-b border-border bg-muted/40 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        aria-hidden
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-2xl shadow-card"
                      >
                        {path.emoji}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold tracking-tight">{path.title}</h2>
                          {isAssigned && <Badge tone="primary">Your path</Badge>}
                          {path.tier === "PREMIUM" && (
                            <Badge tone="warning">
                              <Lock className="size-3" />
                              Premium
                            </Badge>
                          )}
                          {done && (
                            <Badge tone="success">
                              <CheckCircle2 className="size-3" />
                              Complete
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                          {path.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums">{path.percent}%</p>
                      <p className="text-xs text-muted-foreground">
                        {path.completed}/{path.total} lessons
                      </p>
                    </div>
                  </div>

                  <Progress
                    value={path.percent}
                    label={`${path.title} progress`}
                    className={cn("mt-4", done && "[&>div]:bg-success")}
                  />
                </div>

                <ol className="divide-y divide-border">
                  {path.stages.map((stage, index) => (
                    <li key={stage.courseId}>
                      <Link
                        href={`/learn/${stage.slug}`}
                        className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                            stage.percent === 100
                              ? "bg-success-soft text-success"
                              : stage.percent > 0
                                ? "bg-primary-soft text-primary"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          {stage.percent === 100 ? (
                            <CheckCircle2 className="size-4" />
                          ) : (
                            index + 1
                          )}
                        </span>

                        <TrackIcon track={stage.track} size="sm" />

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{stage.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {stage.completed}/{stage.total} lessons
                          </p>
                        </div>

                        <DifficultyBadge difficulty={stage.difficulty} />
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                      </Link>
                    </li>
                  ))}
                </ol>

                <div className="flex flex-wrap items-center gap-3 border-t border-border bg-muted/20 px-5 py-4">
                  {certificate ? (
                    <Link
                      href={`/certificate/${certificate.serial}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      <Trophy className="size-4" />
                      View your certificate
                    </Link>
                  ) : firstIncomplete ? (
                    <p className="text-sm text-muted-foreground">
                      Up next:{" "}
                      <span className="font-medium text-foreground">{firstIncomplete.title}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Every course in this path is finished.
                    </p>
                  )}

                  {firstIncomplete && (
                    <Link
                      href={`/learn/${firstIncomplete.slug}`}
                      className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                      {path.percent > 0 ? "Continue path" : "Start path"}
                      <ArrowRight className="size-4" />
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {assignedPath && assignedPath.percent < 100 && (
        <Card className="flex items-start gap-3 border-primary/30 bg-primary-soft/40 p-5">
          <Award className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{assignedPath.title}</span> is
            assigned to you. Finish every course in it to earn a certificate — it is issued
            automatically the moment your last project is completed.
          </p>
        </Card>
      )}
    </div>
  );
}
