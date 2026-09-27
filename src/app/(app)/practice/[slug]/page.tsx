import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Target, Zap } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { getChallengeBySlug, getPassedChallengeIds, parseCodeFiles, parseTests } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { TrackIcon } from "@/components/track-icon";
import { ChallengeSolver } from "@/components/challenge-solver";
import { LessonBookmarkButton } from "@/components/lesson-actions";
import { parseStringArray } from "@/lib/json";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);
  if (!challenge) return { title: "Challenge not found" };

  return {
    title: challenge.title,
    description: challenge.description,
    alternates: { canonical: `/practice/${challenge.slug}` },
    openGraph: {
      title: `${challenge.title} | CodeLearn`,
      description: challenge.description,
    },
  };
}

export default async function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser(`/practice/${slug}`);

  const challenge = await getChallengeBySlug(slug);
  if (!challenge) notFound();

  const [passed, submissions, bookmark] = await Promise.all([
    getPassedChallengeIds(user.id),
    prisma.challengeSubmission.count({
      where: { userId: user.id, challengeId: challenge.id },
    }),
    prisma.bookmark.findUnique({
      where: {
        userId_contentType_contentId: {
          userId: user.id,
          contentType: "CHALLENGE",
          contentId: challenge.id,
        },
      },
      select: { id: true },
    }),
  ]);

  const tests = parseTests(challenge.tests);
  const hints = parseStringArray(challenge.hints);
  const solved = passed.has(challenge.id);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/practice"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All challenges
        </Link>
        <LessonBookmarkButton
          contentId={challenge.id}
          contentType="CHALLENGE"
          initialBookmarked={Boolean(bookmark)}
        />
      </div>

      {/* ------------------------------ Brief ------------------------------ */}
      <Card className="p-6">
        <div className="flex flex-wrap items-start gap-4">
          <TrackIcon track={challenge.track} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{challenge.title}</h1>
              {solved && (
                <Badge tone="success">
                  <CheckCircle2 className="size-3" />
                  Solved
                </Badge>
              )}
            </div>
            <p className="mt-1.5 text-muted-foreground">{challenge.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={challenge.difficulty} />
              <Badge tone="primary">
                <Zap className="size-3" />
                {challenge.xpReward} XP
              </Badge>
              <Badge tone="neutral">
                {tests.length} test{tests.length === 1 ? "" : "s"}
              </Badge>
              {submissions > 0 && (
                <Badge tone="neutral">
                  {submissions} attempt{submissions === 1 ? "" : "s"}
                </Badge>
              )}
              {hints.length > 0 && (
                <Badge tone="warning">
                  <Lightbulb className="size-3" />
                  {hints.length} hint{hints.length === 1 ? "" : "s"}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2 border-t border-border pt-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Target className="size-4 text-primary" />
            What to build
          </h2>
          <p className="whitespace-pre-line text-[15px] leading-7">{challenge.instructions}</p>
        </div>
      </Card>

      {/* ------------------------------ Solver ------------------------------ */}
      <ChallengeSolver
        challengeId={challenge.id}
        starterCode={parseCodeFiles(challenge.starterCode)}
        solution={parseCodeFiles(challenge.solution)}
        tests={tests}
        alreadyPassed={solved}
        attempts={submissions}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ButtonBack fallback="/practice" label="Back to all challenges" />
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          Ready to build something bigger? Try a project
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function ButtonBack({ fallback, label }: { fallback: string; label: string }) {
  return (
    <Link
      href={fallback}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  );
}
