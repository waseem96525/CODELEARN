import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Every list in the app renders through this so no page is ever blank —
 * an empty list is a prompt, not a void.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  actionHref,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: string;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-14 text-center",
        className,
      )}
    >
      {icon && (
        <div className="flex size-11 items-center justify-center rounded-full bg-card text-muted-foreground shadow-card">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="font-semibold">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && actionHref && (
        <Button asChild size="sm" className="mt-1">
          <a href={actionHref}>{action}</a>
        </Button>
      )}
      {action && !actionHref && (
        <span className="sr-only" role="status">
          {action}
        </span>
      )}
    </div>
  );
}
