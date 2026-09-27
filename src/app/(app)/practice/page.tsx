import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Swords, Trophy } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getChallenges, getPassedChallengeIds } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrackIcon } from "@/components/track-icon";
import { PageHeader } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Practice",
  description: "Coding challenges with automated tests you have to make pass.",
  robots: { index: false, follow: false },
};

const TRACKS = [
  { value: "ALL", label: "All" },
  { value: "HTML", label: "HTML" },
  { value: "CSS", label: "CSS" },
  { value: "JAVASCRIPT", label: "JavaScript" },
] as const;

const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string; difficulty?: string; status?: string }>;
}) {
  const user = await requireUser("/practice");
  const params = await searchParams;

  const [challenges, passed] = await Promise.all([
    getChallenges(),
    getPassedChallengeIds(user.id),
  ]);

  const track = TRACKS.some((t) => t.value === params.track) ? params.track! : "ALL";
  const difficulty = DIFFICULTIES.includes(params.difficulty as never)
    ? params.difficulty!
    : "ALL";
  const status = params.status === "todo" || params.status === "solved" ? params.status : "all";

  const visible = challenges.filter((challenge) => {
    if (track !== "ALL" && challenge.track !== track) return false;
    if (difficulty !== "ALL" && challenge.difficulty !== difficulty) return false;
    if (status === "todo" && passed.has(challenge.id)) return false;
    if (status === "solved" && !passed.has(challenge.id)) return false;
    return true;
  });

  const solvedCount = challenges.filter((c) => passed.has(c.id)).length;
  const percent = challenges.length === 0 ? 0 : Math.round((solvedCount / challenges.length) * 100);
  const next = challenges.find((c) => !passed.has(c.id));

  function href(overrides: Record<string, string | undefined>) {
    const merged: Record<string, string> = {};
    if (track !== "ALL") merged.track = track;
    if (difficulty !== "ALL") merged.difficulty = difficulty;
    if (status !== "all") merged.status = status;
    for (const [key, value] of Object.entries(overrides)) {
      if (value && value !== "ALL" && value !== "all") merged[key] = value;
      else delete merged[key];
    }
    const query = new URLSearchParams(merged).toString();
    return query ? `/practice?${query}` : "/practice";
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader
        title="Practice"
        description="Write real code and make the tests pass. Every challenge is checked automatically."
      >
        {next && (
          <Button asChild>
            <Link href={`/practice/${next.slug}`}>
              Next challenge
              <ArrowRight />
            </Link>
          </Button>
        )}
      </PageHeader>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-primary" />
            <p className="text-sm font-semibold">Solved</p>
            <Badge tone="neutral">
              {solvedCount}/{challenges.length}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{percent}% of all challenges</p>
        </div>
        <Progress value={percent} label="Challenge progress" className="mt-3" />
      </Card>

      {/* ------------------------------ Filters ------------------------------ */}
      <div className="space-y-3">
        <nav aria-label="Filter by track" className="flex flex-wrap gap-2">
          {TRACKS.map((t) => (
            <FilterLink key={t.value} href={href({ track: t.value })} active={track === t.value}>
              {t.label}
            </FilterLink>
          ))}
        </nav>
        <nav aria-label="Filter by difficulty" className="flex flex-wrap gap-2">
          {["ALL", ...DIFFICULTIES].map((d) => (
            <FilterLink
              key={d}
              href={href({ difficulty: d })}
              active={difficulty === d}
            >
              {d === "ALL" ? "Any level" : d.charAt(0) + d.slice(1).toLowerCase()}
            </FilterLink>
          ))}
        </nav>
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "Everything" },
            { value: "todo", label: "To do" },
            { value: "solved", label: "Solved" },
          ].map((s) => (
            <FilterLink key={s.value} href={href({ status: s.value })} active={status === s.value}>
              {s.label}
            </FilterLink>
          ))}
        </nav>
      </div>

      {/* ------------------------------ Listing ------------------------------ */}
      {visible.length === 0 ? (
        <EmptyState
          icon={<Swords className="size-5" />}
          title="No challenges match these filters"
          description="Clear a filter to see the rest of the challenge set."
          action="Show everything"
          actionHref="/practice"
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((challenge) => {
            const isSolved = passed.has(challenge.id);
            return (
              <li key={challenge.id}>
                <Card interactive className="p-5">
                  <div className="flex flex-wrap items-start gap-4">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg",
                        isSolved ? "bg-success-soft text-success" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isSolved ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <Circle className="size-4" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold">{challenge.title}</h2>
                        {isSolved && <Badge tone="success">Solved</Badge>}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {challenge.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <TrackIcon track={challenge.track} size="sm" />
                        <DifficultyBadge difficulty={challenge.difficulty} />
                        <Badge tone="neutral">{challenge.xpReward} XP</Badge>
                      </div>
                    </div>

                    <Button asChild size="sm" variant={isSolved ? "outline" : "primary"}>
                      <Link href={`/practice/${challenge.slug}`}>
                        {isSolved ? "Try again" : "Solve"}
                        <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        Tests run in a sandboxed preview inside your browser, so nothing you write can reach
        the app or the network. XP is awarded once per challenge.
      </p>
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        active
          ? "border-primary/30 bg-primary-soft text-primary"
          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
