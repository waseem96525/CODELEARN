"use client";

import * as React from "react";
import { CheckCircle2, Lightbulb, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeSample } from "@/components/code-sample";
import type { LessonBlock } from "@/lib/types";

type PredictBlock = Extract<LessonBlock, { type: "predict" }>;

/**
 * "Predict the output" interaction from the spec. The learner commits to an
 * answer before seeing the explanation, so they have to actually reason about
 * the code rather than pattern-match.
 */
export function PredictQuestion({ block }: { block: PredictBlock }) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const isCorrect = selected === block.answerIndex;
  const letters = ["A", "B", "C", "D", "E", "F"];

  function choose(index: number) {
    if (selected !== null) return;
    setSelected(index);
    // Small delay so the selection registers before the feedback animates in.
    window.setTimeout(() => setShowExplanation(true), 120);
  }

  function reset() {
    setSelected(null);
    setShowExplanation(false);
  }

  return (
    <section
      className="rounded-xl border border-border bg-card p-5 shadow-card"
      aria-labelledby="predict-heading"
    >
      <h3 id="predict-heading" className="flex items-center gap-2 font-semibold">
        <Lightbulb className="size-4 text-primary" />
        Predict the output
      </h3>

      <p className="mt-2 text-[15px] leading-7">{block.prompt}</p>

      {block.code && (
        <CodeSample
          code={block.code}
          lang="javascript"
          className="mt-3"
          caption="Work out the result before you choose."
        />
      )}

      <div role="radiogroup" aria-label="Answer options" className="mt-4 space-y-2">
        {block.options.map((option, index) => {
          const isSelected = selected === index;
          const isAnswer = index === block.answerIndex;
          const revealed = selected !== null;

          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={selected !== null}
              onClick={() => choose(index)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-default",
                !revealed && "border-border hover:border-primary/50 hover:bg-muted/50",
                revealed && isAnswer && "border-success bg-success-soft",
                revealed && isSelected && !isAnswer && "border-danger bg-danger-soft",
                revealed && !isSelected && !isAnswer && "border-border opacity-60",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold",
                  !revealed && "border-input",
                  revealed && isAnswer && "border-success bg-success text-white",
                  revealed && isSelected && !isAnswer && "border-danger bg-danger text-white",
                  revealed && !isSelected && !isAnswer && "border-input text-muted-foreground",
                )}
              >
                {letters[index]}
              </span>
              <code className="font-mono">{option}</code>
              {revealed && isAnswer && <CheckCircle2 className="ml-auto size-4 text-success" />}
              {revealed && isSelected && !isAnswer && (
                <XCircle className="ml-auto size-4 text-danger" />
              )}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div
          role="status"
          className={cn(
            "mt-4 rounded-lg border p-4",
            isCorrect ? "border-success/30 bg-success-soft" : "border-danger/30 bg-danger-soft",
          )}
        >
          <p className={cn("text-sm font-semibold", isCorrect ? "text-success" : "text-danger")}>
            {isCorrect ? "Correct" : `Not quite — the answer is ${letters[block.answerIndex]}`}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
            {block.explanation}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}
    </section>
  );
}
