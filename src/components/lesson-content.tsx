"use client";

import * as React from "react";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Info,
  Lightbulb,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonBlock } from "@/lib/types";
import { CodePlayground } from "@/components/playground/code-playground";
import { CodeSample } from "@/components/code-sample";
import { PredictQuestion } from "@/components/predict-question";
import { ExerciseBlock } from "@/components/exercise-block";

/**
 * Renders a lesson's content blocks generically.
 *
 * Authoring lessons as data (rather than hand-written JSX) means the CSS and
 * JavaScript courses reuse this exact renderer, and new block types appear
 * everywhere at once.
 */
export function LessonContent({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "heading": {
      const Tag = block.level === 3 ? "h3" : "h2";
      return (
        <Tag className="pt-2 text-xl font-bold tracking-tight">{block.text}</Tag>
      );
    }

    case "paragraph":
      return <Prose text={block.text} />;

    case "code":
      return <CodeSample lang={block.lang} code={block.code} caption={block.caption} />;

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={cn(
            "space-y-2 pl-5 text-[15px] leading-7",
            block.ordered ? "list-decimal" : "list-disc",
          )}
        >
          {block.items.map((item, i) => (
            <li key={i} className="marker:text-primary">
              <Prose text={item} inline />
            </li>
          ))}
        </Tag>
      );
    }

    case "callout":
      return <Callout block={block} />;

    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/60">
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    scope="col"
                    className="px-4 py-2.5 text-left font-semibold"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2.5 align-top">
                      <Prose text={cell} inline />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "playground":
      return (
        <div className="space-y-2">
          <p className="text-sm font-semibold">Try it yourself</p>
          <CodePlayground
            initialFiles={block.files}
            instructions={block.instructions}
            height={block.height ?? 280}
            readOnly
          />
        </div>
      );

    case "predict":
      return <PredictQuestion block={block} />;

    case "exercise":
      return <ExerciseBlock block={block} />;

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Inline markdown-lite: **bold** and `code`
// ---------------------------------------------------------------------------

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`)/g;

export function Prose({ text, inline = false }: { text: string; inline?: boolean }) {
  const parts = text.split(INLINE).filter(Boolean);

  const content = parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });

  return (
    <p className={cn("text-[15px] leading-7 text-foreground/90", inline && "inline")}>
      {content}
    </p>
  );
}

const CALLOUT_STYLES = {
  tip: {
    icon: Lightbulb,
    wrapper: "border-info/30 bg-info-soft",
    title: "text-info",
  },
  warning: {
    icon: AlertTriangle,
    wrapper: "border-warning/30 bg-warning-soft",
    title: "text-warning",
  },
  info: {
    icon: Info,
    wrapper: "border-border bg-muted/60",
    title: "text-foreground",
  },
  "best-practice": {
    icon: Award,
    wrapper: "border-success/30 bg-success-soft",
    title: "text-success",
  },
  mistake: {
    icon: XCircle,
    wrapper: "border-danger/30 bg-danger-soft",
    title: "text-danger",
  },
} as const;

function Callout({
  block,
}: {
  block: Extract<LessonBlock, { type: "callout" }>;
}) {
  const style = CALLOUT_STYLES[block.variant];
  const Icon = style.icon;

  return (
    <aside className={cn("flex gap-3 rounded-xl border p-4", style.wrapper)}>
      <Icon className={cn("mt-0.5 size-5 shrink-0", style.title)} />
      <div className="min-w-0 space-y-1">
        <p className={cn("text-sm font-semibold", style.title)}>{block.title}</p>
        <Prose text={block.text} />
      </div>
    </aside>
  );
}

export { CheckCircle2 };
