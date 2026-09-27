import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Dense metric tile used across the dashboard and admin analytics. */
export function StatCard({
  label,
  value,
  sublabel,
  icon,
  href,
  tone = "primary",
  className,
}: {
  label: string;
  value: React.ReactNode;
  sublabel?: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  tone?: "primary" | "success" | "warning" | "info";
  className?: string;
}) {
  const toneClass = {
    primary: "text-primary bg-primary-soft",
    success: "text-success bg-success-soft",
    warning: "text-warning bg-warning-soft",
    info: "text-info bg-info-soft",
  }[tone];

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && (
          <span className={cn("flex size-8 items-center justify-center rounded-lg", toneClass)}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
      {sublabel && <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>}
    </>
  );

  if (href) {
    return (
      <Card interactive className={cn("p-5", className)}>
        <Link href={href} className="block focus-visible:outline-none">
          {inner}
        </Link>
      </Card>
    );
  }
  return <Card className={cn("p-5", className)}>{inner}</Card>;
}

/** Big "continue where you left off" panel on the dashboard. */
export function ContinueCard({
  courseTitle,
  track,
  progress,
  lessonTitle,
  lessonHref,
  minutes,
}: {
  courseTitle: string;
  track: string;
  progress: number;
  lessonTitle: string;
  lessonHref: string;
  minutes: number;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Continue learning
          </p>
          <div className="space-y-1">
            <h2 className="truncate text-xl font-bold tracking-tight">{courseTitle}</h2>
            <p className="truncate text-sm text-muted-foreground">
              Next up: {lessonTitle}
              <span className="mx-2 text-border">|</span>
              <Clock className="mr-1 inline size-3.5 align-text-bottom" />
              {minutes} min
            </p>
          </div>
          <div className="space-y-1.5">
            <Progress value={progress} label={`${courseTitle} progress`} />
            <p className="text-xs font-medium text-muted-foreground">{progress}% complete</p>
          </div>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link href={lessonHref}>
            Continue Learning
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
