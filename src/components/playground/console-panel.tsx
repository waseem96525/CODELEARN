"use client";

import * as React from "react";
import { AlertTriangle, Info, Terminal, Trash2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { explainError, type ErrorExplanation } from "@/lib/playground/error-help";

export type ConsoleLevel = "log" | "info" | "warn" | "error" | "debug" | "ready";

export interface ConsoleEntry {
  id: number;
  level: ConsoleLevel;
  text: string;
}

const LEVEL_STYLE: Record<ConsoleLevel, { icon: React.ReactNode; className: string }> = {
  log: { icon: <Terminal className="size-3.5" />, className: "text-foreground" },
  info: { icon: <Info className="size-3.5" />, className: "text-info" },
  debug: { icon: <Info className="size-3.5" />, className: "text-muted-foreground" },
  warn: { icon: <AlertTriangle className="size-3.5" />, className: "text-warning" },
  error: { icon: <XCircle className="size-3.5" />, className: "text-danger" },
  ready: { icon: <Info className="size-3.5" />, className: "text-muted-foreground" },
};

/** Terminal-style output from the sandboxed preview, plus a plain error explainer. */
export function ConsolePanel({
  entries,
  onClear,
  className,
}: {
  entries: ConsoleEntry[];
  onClear: () => void;
  className?: string;
}) {
  const visible = entries.filter((e) => e.level !== "ready");
  const firstError = visible.find((e) => e.level === "error") ?? null;
  const explanation: ErrorExplanation | null = firstError
    ? explainError(firstError.text)
    : null;

  return (
    <div className={cn("flex min-h-0 flex-col bg-editor", className)}>
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Console
          {visible.length > 0 && (
            <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums">
              {visible.length}
            </span>
          )}
        </span>
        {visible.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label="Clear console"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto px-3 py-2 font-mono text-xs leading-relaxed"
        role="log"
        aria-live="polite"
        aria-label="Console output"
      >
        {visible.length === 0 ? (
          <p className="text-muted-foreground">
            Nothing yet. Use <code className="text-foreground">console.log()</code> to print values.
          </p>
        ) : (
          <ul className="space-y-1">
            {visible.map((entry) => (
              <li key={entry.id} className="flex gap-2">
                <span className={cn("mt-0.5 shrink-0", LEVEL_STYLE[entry.level].className)}>
                  {LEVEL_STYLE[entry.level].icon}
                </span>
                <span className="whitespace-pre-wrap break-words text-foreground/90">
                  {entry.text}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {explanation && firstError && (
        <ErrorExplainer explanation={explanation} raw={firstError.text} />
      )}
    </div>
  );
}

export function ErrorExplainer({
  explanation,
  raw,
}: {
  explanation: ErrorExplanation;
  raw: string;
}) {
  return (
    <div className="border-t border-danger/30 bg-danger-soft p-3 text-xs">
      <p className="font-semibold text-danger">Error: {raw}</p>
      <p className="mt-2 font-semibold">What does this mean?</p>
      <p className="mt-1 leading-relaxed text-foreground/80">{explanation.meaning}</p>
      <p className="mt-2 font-semibold">How to fix it</p>
      <p className="mt-1 leading-relaxed text-foreground/80">{explanation.fix}</p>
      {explanation.example && (
        <pre className="mt-2 overflow-x-auto rounded-md border border-danger/20 bg-editor p-2 font-mono text-[11px] leading-relaxed text-foreground">
          <code>{explanation.example.code}</code>
        </pre>
      )}
    </div>
  );
}
