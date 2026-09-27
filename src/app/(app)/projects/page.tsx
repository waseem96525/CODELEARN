import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FolderGit2, Layers, Trophy } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getProjects, getUserProjects } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrackIcon, TrackChip } from "@/components/track-icon";
import { PageHeader } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description: "Build complete projects and keep them in your portfolio.",
  robots: { index: false, follow: false },
};

export default async function ProjectsPage() {
  const user = await requireUser("/projects");

  const [projects, mine] = await Promise.all([
    getProjects(),
    getUserProjects(user.id),
  ]);

  const completedCount = mine.filter((p) => p.completed).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader
        title="Projects"
        description="Build something real. Each project is a multi-file app with a design reference and a checklist."
      >
        <Badge tone="neutral">
          <Trophy className="size-3" />
          {completedCount} of {projects.length} briefs complete
        </Badge>
      </PageHeader>

      {/* --------------------------- Your portfolio --------------------------- */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Your projects</h2>
        {mine.length === 0 ? (
          <EmptyState
            icon={<FolderGit2 className="size-5" />}
            title="Nothing started yet"
            description="Pick a brief below to open the editor. Your work saves as you go."
            action="See project briefs"
            actionHref="#briefs"
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {mine.map((record) => (
              <li key={record.id}>
                <Card interactive className="h-full p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{record.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {record.project.title} &middot; updated {timeAgo(record.updatedAt)}
                      </p>
                    </div>
                    {record.completed && (
                      <Badge tone="success">
                        <CheckCircle2 className="size-3" />
                        Done
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <TrackChip track={record.project.track} />
                    <DifficultyBadge difficulty={record.project.difficulty} />
                  </div>
                  <Button asChild size="sm" variant="outline" className="mt-4 w-full">
                    <Link href={`/projects/${record.id}`}>
                      Open
                      <ArrowRight />
                    </Link>
                  </Button>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ------------------------------ Briefs ------------------------------ */}
      <section id="briefs" className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Layers className="size-4 text-primary" />
          Project briefs
        </h2>
        {projects.length === 0 ? (
          <EmptyState
            icon={<FolderGit2 className="size-5" />}
            title="No projects published yet"
            description="Check back soon — new briefs land with every course release."
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {projects.map((project) => {
              const started = mine.find((record) => record.projectId === project.id);
              return (
                <li key={project.id}>
                  <Card interactive className="flex h-full flex-col p-5">
                    <div className="flex items-start gap-3">
                      <TrackIcon track={project.track} size="md" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <DifficultyBadge difficulty={project.difficulty} />
                      <Badge tone="primary">{project.xpReward} XP</Badge>
                      {started && (
                        <Badge tone={started.completed ? "success" : "info"}>
                          {started.completed ? "Completed" : "In progress"}
                        </Badge>
                      )}
                    </div>

                    <Button asChild size="sm" className="mt-5 w-full">
                      <Link href={`/projects/${project.slug}`}>
                        {started ? (started.completed ? "Start another" : "Continue") : "Start project"}
                        <ArrowRight />
                      </Link>
                    </Button>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
