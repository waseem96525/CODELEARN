import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bookmark, FolderGit2, Swords } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getBookmarks } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrackChip } from "@/components/track-icon";
import { PageHeader } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Everything you have saved to come back to.",
  robots: { index: false, follow: false },
};

const FILTERS = [
  { value: "ALL", label: "All" },
  { value: "LESSON", label: "Lessons" },
  { value: "CHALLENGE", label: "Challenges" },
  { value: "PROJECT", label: "Projects" },
] as const;

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const user = await requireUser("/bookmarks");
  const { type } = await searchParams;

  const bookmarks = await getBookmarks(user.id);
  const active = FILTERS.some((f) => f.value === type) ? type! : "ALL";
  const visible = active === "ALL" ? bookmarks : bookmarks.filter((b) => b.contentType === active);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader
        title="Bookmarks"
        description="Saved lessons, challenges and projects, newest first."
      >
        <Badge tone="neutral">{bookmarks.length} saved</Badge>
      </PageHeader>

      <nav aria-label="Filter bookmarks" className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === "ALL" ? "/bookmarks" : `/bookmarks?type=${filter.value}`}
            aria-current={active === filter.value ? "page" : undefined}
            className={
              active === filter.value
                ? "rounded-full border border-primary/30 bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary"
                : "rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            }
          >
            {filter.label}
          </Link>
        ))}
      </nav>

      {visible.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="size-5" />}
          title={bookmarks.length === 0 ? "Nothing bookmarked yet" : "Nothing in this category"}
          description={
            bookmarks.length === 0
              ? "Use the bookmark button on any lesson, challenge or project to save it here."
              : "Try another category."
          }
          action="Browse courses"
          actionHref="/learn"
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((entry) => (
            <li key={entry.id}>
              <Card className="flex flex-wrap items-center gap-4 p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  {entry.detail === "Lesson" ? (
                    <Bookmark className="size-4" />
                  ) : entry.detail === "Challenge" ? (
                    <Swords className="size-4" />
                  ) : (
                    <FolderGit2 className="size-4" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{entry.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {entry.detail} &middot; saved {timeAgo(entry.createdAt)}
                    {!entry.available && " · no longer available"}
                  </p>
                </div>

                {entry.track && <TrackChip track={entry.track} />}

                {entry.available ? (
                  <Link
                    href={entry.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Open
                    <ArrowRight className="size-4" />
                  </Link>
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">
                    Unpublished
                  </span>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
