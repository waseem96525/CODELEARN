import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Search } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CodeSample } from "@/components/code-sample";
import { TrackChip } from "@/components/track-icon";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Quick Reference",
  description:
    "Cheat sheets for HTML, CSS and JavaScript: syntax, examples and common mistakes.",
};

// Served on demand so the seed data is always fresh — and so the build does
// not need a database connection to prerender this page.
export const dynamic = "force-dynamic";

const TRACKS = ["ALL", "HTML", "CSS", "JAVASCRIPT"] as const;

const TRACK_LANG: Record<string, "html" | "css" | "javascript"> = {
  HTML: "html",
  CSS: "css",
  JAVASCRIPT: "javascript",
};

function parseMistakes(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((m): m is string => typeof m === "string") : [];
  } catch {
    return [];
  }
}

export default async function ReferencePage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string; q?: string }>;
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);

  const track = TRACKS.includes(params.track as never) ? params.track! : "ALL";
  const query = (params.q ?? "").trim().toLowerCase();

  const entries = await prisma.referenceEntry.findMany({
    orderBy: { orderIndex: "asc" },
  });

  const visible = entries.filter((entry) => {
    if (track !== "ALL" && entry.track !== track) return false;
    if (!query) return true;
    const haystack = `${entry.title} ${entry.syntax} ${entry.summary} ${entry.keywords}`.toLowerCase();
    return query.split(/\s+/).every((word) => haystack.includes(word));
  });

  function hrefFor(next: { track?: string; q?: string }): string {
    const parts: string[] = [];
    const t = next.track ?? track;
    const q = next.q ?? params.q ?? "";
    if (t !== "ALL") parts.push(`track=${encodeURIComponent(t)}`);
    if (q.trim()) parts.push(`q=${encodeURIComponent(q.trim())}`);
    return parts.length > 0 ? `/reference?${parts.join("&")}` : "/reference";
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 lg:px-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">Quick reference</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Cheat sheets for the things you look up constantly: syntax, a copyable
            example, and the mistakes everyone makes at first.
          </p>
        </div>

        <form
          method="get"
          action="/reference"
          role="search"
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          {track !== "ALL" && <input type="hidden" name="track" value={track} />}
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search tags, elements, properties… (e.g. flex, link, loop)"
              aria-label="Search reference entries"
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Filter by track">
          {TRACKS.map((t) => (
            <Link
              key={t}
              href={hrefFor({ track: t })}
              aria-current={track === t ? "true" : undefined}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                track === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "ALL" ? "All" : t === "JAVASCRIPT" ? "JavaScript" : t.charAt(0) + t.slice(1).toLowerCase()}
            </Link>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            {visible.length} of {entries.length} entries
          </span>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            title="No entries match"
            description="Try a different keyword, or browse a single track instead of searching."
            action="Clear search"
            actionHref="/reference"
            className="mt-8"
          />
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {visible.map((entry) => {
              const mistakes = parseMistakes(entry.mistakes);
              return (
                <Card key={entry.id} className="flex flex-col p-5">
                  <div className="flex items-center gap-2">
                    <TrackChip track={entry.track} />
                    <h2 className="font-mono text-sm font-semibold">{entry.title}</h2>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {entry.summary}
                  </p>
                  <CodeSample
                    code={entry.syntax}
                    lang={TRACK_LANG[entry.track] ?? "html"}
                    caption="Syntax"
                    className="mt-3"
                  />
                  <CodeSample
                    code={entry.example}
                    lang={TRACK_LANG[entry.track] ?? "html"}
                    caption="Example — copy and try it in the playground"
                    className="mt-3"
                  />
                  {mistakes.length > 0 && (
                    <div className="mt-3 rounded-lg border border-warning/30 bg-warning-soft p-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-warning">
                        <AlertTriangle className="size-3.5" aria-hidden />
                        Common mistakes
                      </p>
                      <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-muted-foreground">
                        {mistakes.map((mistake) => (
                          <li key={mistake}>&middot; {mistake}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <Card className="mt-10 p-6 text-center">
          <h2 className="font-semibold">Learn these for real, not just look them up</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Every entry above is taught hands-on in the courses — with a live editor on
            every page.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button asChild>
              <Link href="/learn">Browse courses</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/playground">Open playground</Link>
            </Button>
          </div>
        </Card>
      </main>

      <SiteFooter />
    </div>
  );
}
