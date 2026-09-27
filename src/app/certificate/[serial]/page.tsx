import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, CheckCircle2, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { getLevelInfo } from "@/lib/gamification";
import { SITE_NAME, siteUrl } from "@/lib/site";
import { formatDate, formatXp, initialsOf } from "@/lib/utils";

/**
 * Certificates live outside the authenticated layout on purpose: the whole
 * point of one is that it can be opened by someone who is not signed in (a
 * hiring manager, a teacher). Nothing else about the account is exposed — the
 * serial is the only identifier, and it is unguessable.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ serial: string }>;
}): Promise<Metadata> {
  const { serial } = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { serial },
    include: {
      user: { select: { name: true } },
      path: { select: { title: true } },
    },
  });
  if (!certificate) return { title: "Certificate not found" };

  return {
    title: `${certificate.path.title} certificate`,
    description: `A CodeLearn certificate issued to ${certificate.user.name}.`,
    alternates: { canonical: `/certificate/${certificate.serial}` },
  };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: { serial },
    include: {
      user: { select: { name: true, xp: true, level: true, bio: true } },
      path: {
        select: {
          title: true,
          description: true,
          emoji: true,
          stages: {
            orderBy: { orderIndex: "asc" },
            select: { course: { select: { title: true } } },
          },
        },
      },
    },
  });
  if (!certificate) notFound();

  const level = getLevelInfo(certificate.user.xp);

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="font-bold tracking-tight">
            {SITE_NAME}
          </Link>
          <Button asChild size="sm" variant="outline">
            <Link href="/signup">Start learning</Link>
          </Button>
        </div>

        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-pop">
          <div className="border-b border-border bg-primary-soft/40 p-8 text-center">
            <span aria-hidden className="text-5xl">
              {certificate.path.emoji}
            </span>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Certificate of completion
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight lg:text-3xl">
              {certificate.path.title}
            </h1>
          </div>

          <div className="space-y-6 p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <span
                aria-hidden
                className="flex size-20 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground"
              >
                {initialsOf(certificate.user.name)}
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Awarded to</p>
                <p className="text-xl font-bold">{certificate.user.name}</p>
                {certificate.user.bio && (
                  <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                    {certificate.user.bio}
                  </p>
                )}
              </div>
            </div>

            <p className="text-center text-[15px] leading-7 text-muted-foreground">
              has completed every course in this learning path —{" "}
              {certificate.path.stages.map((stage) => stage.course.title).join(", ")} — with{" "}
              {formatXp(certificate.user.xp)} XP at level {certificate.user.level} (
              {level.name}).
            </p>

            <ul className="grid gap-2 sm:grid-cols-2">
              {certificate.path.stages.map((stage) => (
                <li
                  key={stage.course.title}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <CheckCircle2 className="size-4 shrink-0 text-success" />
                  {stage.course.title}
                </li>
              ))}
            </ul>

            <dl className="grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Issued</dt>
                <dd className="mt-0.5 font-semibold">{formatDate(certificate.issuedAt)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Serial</dt>
                <dd className="mt-0.5 font-mono font-semibold">{certificate.serial}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Issued by</dt>
                <dd className="mt-0.5 font-semibold">{SITE_NAME}</dd>
              </div>
            </dl>
          </div>
        </article>

        <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <Award className="size-3.5" />
          Verify this certificate at {siteUrl()}/certificate/{certificate.serial}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="sm">
            <Link href="/learn">
              <Sparkles />
              Start your own path
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/roadmap">See the roadmap</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
