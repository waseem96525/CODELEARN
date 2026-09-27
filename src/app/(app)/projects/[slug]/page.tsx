import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Zap } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { parseCodeFiles, parseFiles } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { TrackIcon } from "@/components/track-icon";
import { ProjectWorkspace } from "@/components/project-workspace";
import { LessonBookmarkButton } from "@/components/lesson-actions";
import { parseStringArray } from "@/lib/json";

/**
 * The route accepts either a project slug (`/projects/portfolio`) or a specific
 * copy the user owns (`/projects/<userProjectId>`), so a duplicate or a saved
 * project can be opened directly.
 */
async function resolve(slug: string, userId: string) {
  const bySlug = await prisma.project.findFirst({
    where: { slug, published: true },
    select: { id: true },
  });
  if (bySlug) return { projectId: bySlug.id, userProjectId: null };

  // A copy id — ownership is enforced here so nobody can open someone else's.
  const copy = await prisma.userProject.findFirst({
    where: { id: slug, userId },
    select: { id: true, projectId: true },
  });
  if (copy) return { projectId: copy.projectId, userProjectId: copy.id };

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findFirst({
    where: { OR: [{ slug }, { userProjects: { some: { id: slug } } }], published: true },
    select: { title: true, description: true, slug: true },
  });
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} | CodeLearn`,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser(`/projects/${slug}`);

  const resolved = await resolve(slug, user.id);
  if (!resolved) notFound();

  const project = await prisma.project.findFirst({
    where: { id: resolved.projectId, published: true },
  });
  if (!project) notFound();

  const [copy, bookmark] = await Promise.all([
    resolved.userProjectId
      ? prisma.userProject.findFirst({ where: { id: resolved.userProjectId, userId: user.id } })
      : prisma.userProject.findFirst({
          where: { userId: user.id, projectId: project.id },
          orderBy: { createdAt: "asc" },
        }),
    prisma.bookmark.findUnique({
      where: {
        userId_contentType_contentId: {
          userId: user.id,
          contentType: "PROJECT",
          contentId: project.id,
        },
      },
      select: { id: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All projects
        </Link>
        <LessonBookmarkButton
          contentId={project.id}
          contentType="PROJECT"
          initialBookmarked={Boolean(bookmark)}
        />
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-start gap-4">
          <TrackIcon track={project.track} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
              {copy?.completed && (
                <Badge tone="success">
                  <CheckCircle2 className="size-3" />
                  Completed
                </Badge>
              )}
            </div>
            <p className="mt-1.5 text-muted-foreground">{project.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={project.difficulty} />
              <Badge tone="primary">
                <Zap className="size-3" />
                {project.xpReward} XP
              </Badge>
              <Badge tone="neutral">
                {Object.keys(parseFiles<Record<string, string>>(project.starterFiles, {})).length}{" "}
                starter files
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <ProjectWorkspace
        projectId={project.id}
        userProject={
          copy
            ? {
                id: copy.id,
                name: copy.name,
                files: parseFiles<Record<string, string>>(copy.files, {}),
                checklist: parseFiles<number[]>(copy.checklist, []),
                completed: copy.completed,
              }
            : null
        }
        starterFiles={parseFiles<Record<string, string>>(project.starterFiles, {
          "index.html": "<!DOCTYPE html>\n<html>\n<body>\n</body>\n</html>",
        })}
        checklist={parseStringArray(project.checklist)}
        requirements={parseStringArray(project.requirements)}
        designReference={parseCodeFiles(project.designReference)}
        xpReward={project.xpReward}
        completed={copy?.completed ?? false}
      />
    </div>
  );
}
