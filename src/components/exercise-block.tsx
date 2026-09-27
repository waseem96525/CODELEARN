"use client";

import * as React from "react";
import { Check, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodePlayground } from "@/components/playground/code-playground";
import type { LessonBlock } from "@/lib/types";

type ExerciseBlockType = Extract<LessonBlock, { type: "exercise" }>;

/**
 * Practice exercise with a self-marked checklist and a sandboxed editor.
 * Progress is local to the component — the authoritative record of finishing a
 * lesson is the quiz plus the "Mark complete" action on the lesson page.
 */
export function ExerciseBlock({ block }: { block: ExerciseBlockType }) {
  const [checked, setChecked] = React.useState<Set<number>>(new Set());
  const [attempts, setAttempts] = React.useState(0);

  function toggle(index: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <section
      className="rounded-xl border border-primary/30 bg-primary-soft/30 p-5"
      aria-labelledby="exercise-heading"
    >
      <h3 id="exercise-heading" className="flex items-center gap-2 font-semibold">
        <Dumbbell className="size-4 text-primary" />
        Your turn
      </h3>

      <p className="mt-2 text-[15px] leading-7">{block.prompt}</p>

      <div className="mt-4">
        <CodePlayground
          key={attempts}
          initialFiles={block.starter}
          height={300}
          instructions="Write your answer here. There is no submit button — experiment until it looks right."
        />
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-semibold">Did you cover everything?</p>
        <ul className="mt-3 space-y-2">
          {block.checklist.map((item, index) => {
            const done = checked.has(index);
            return (
              <li key={index}>
                <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggle(index)}
                    className="mt-0.5 size-4 shrink-0 rounded border-input accent-[hsl(var(--primary))]"
                  />
                  <span className={cn(done && "text-muted-foreground line-through")}>{item}</span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-xs text-muted-foreground">
            {checked.size} of {block.checklist.length} checked
          </p>
          {checked.size === block.checklist.length && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-success">
              <Check className="size-3.5" />
              All done — nice work
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              setChecked(new Set());
              setAttempts((a) => a + 1);
            }}
            className="ml-auto text-xs font-medium text-primary hover:underline"
          >
            Clear and start again
          </button>
        </div>
      </div>
    </section>
  );
}
