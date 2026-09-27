"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CodeSample } from "@/components/code-sample";
import { gradeQuiz, type QuizResult } from "@/app/(app)/actions/quiz";
import type { QuestionType } from "@/lib/types";

export interface QuizQuestionData {
  id: string;
  question: string;
  type: QuestionType;
  code: string | null;
  explanation: string | null;
  xpReward: number;
  options: { id: string; optionText: string; isCorrect: boolean }[];
}

/** True/false and multiple-choice are single-select; multiple-answer is not. */
function isMultiSelect(type: QuestionType): boolean {
  return type === "MULTIPLE_ANSWER";
}

const TYPE_LABEL: Record<QuestionType, string> = {
  MULTIPLE_CHOICE: "Multiple choice",
  TRUE_FALSE: "True or false",
  CODE_OUTPUT: "What does this output?",
  CODE_COMPLETION: "Complete the code",
  DEBUGGING: "Find the bug",
  MULTIPLE_ANSWER: "Select all that apply",
};

export function Quiz({
  lessonId,
  questions,
}: {
  lessonId: string;
  questions: QuizQuestionData[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = React.useState<Record<string, string[]>>({});
  const [result, setResult] = React.useState<QuizResult | null>(null);
  const [pending, startTransition] = React.useTransition();

  if (questions.length === 0) return null;

  const answeredCount = Object.values(answers).filter((a) => a.length > 0).length;
  const allAnswered = answeredCount === questions.length;

  function toggle(questionId: string, optionId: string, multi: boolean) {
    setResult(null);
    setAnswers((prev) => {
      const current = prev[questionId] ?? [];
      if (!multi) {
        return { ...prev, [questionId]: [optionId] };
      }
      return {
        ...prev,
        [questionId]: current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      };
    });
  }

  function submit() {
    startTransition(async () => {
      const payload = Object.entries(answers)
        .filter(([, optionIds]) => optionIds.length > 0)
        .map(([questionId, optionIds]) => ({ questionId, optionIds }));

      const response = await gradeQuiz(lessonId, payload);
      if (!response.ok) {
        toast.error(response.error ?? "Could not grade your quiz.");
        return;
      }

      setResult(response);
      router.refresh();

      if (response.perfect) {
        toast.success("Perfect score!", {
          description: `+${response.xpGained} XP earned.`,
        });
      } else {
        toast.success(`You scored ${response.correctCount}/${response.total}`, {
          description: `+${response.xpGained} XP earned.`,
        });
      }
    });
  }

  function retry() {
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="space-y-4" aria-labelledby="quiz-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="quiz-heading" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Lightbulb className="size-5 text-primary" />
          Check your understanding
        </h2>
        <Badge tone="neutral">
          {answeredCount} / {questions.length} answered
        </Badge>
      </div>

      {!result && (
        <Progress
          value={(answeredCount / questions.length) * 100}
          label="Quiz answers completed"
        />
      )}

      {questions.map((question, index) => {
        const given = answers[question.id] ?? [];
        const revealed = result !== null;
        const multi = isMultiSelect(question.type);

        return (
          <Card key={question.id} className="p-5">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{question.question}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {TYPE_LABEL[question.type]} &middot; {question.xpReward} XP
                  </p>
                </div>
              </div>

              {question.code && (
                <CodeSample code={question.code} lang="javascript" className="ml-10" />
              )}

              <div
                role={multi ? "group" : "radiogroup"}
                aria-label={question.question}
                className="ml-10 space-y-2"
              >
                {question.options.map((option) => {
                  const chosen = given.includes(option.id);
                  const isCorrect = option.isCorrect;
                  const showAsCorrect = revealed && isCorrect;
                  const showAsWrong = revealed && chosen && !isCorrect;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      role={multi ? "checkbox" : "radio"}
                      aria-checked={chosen}
                      disabled={revealed}
                      onClick={() => toggle(question.id, option.id, multi)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-default",
                        !revealed &&
                          (chosen
                            ? "border-primary bg-primary-soft"
                            : "border-border hover:border-primary/40 hover:bg-muted/50"),
                        showAsCorrect && "border-success bg-success-soft",
                        showAsWrong && "border-danger bg-danger-soft",
                        revealed && !chosen && !isCorrect && "border-border opacity-60",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center border-2",
                          multi ? "rounded" : "rounded-full",
                          !revealed && (chosen ? "border-primary bg-primary" : "border-input"),
                          showAsCorrect && "border-success bg-success",
                          showAsWrong && "border-danger bg-danger",
                          revealed && !chosen && !isCorrect && "border-input",
                        )}
                      >
                        {chosen && (
                          <span
                            className={cn(
                              "block bg-primary-foreground",
                              multi ? "size-2 rounded-sm" : "size-2 rounded-full",
                            )}
                          />
                        )}
                      </span>
                      <code className="font-mono">{option.optionText}</code>
                      {showAsCorrect && <CheckCircle2 className="ml-auto size-4 text-success" />}
                      {showAsWrong && <XCircle className="ml-auto size-4 text-danger" />}
                    </button>
                  );
                })}
              </div>

              {revealed && question.explanation && (
                <div className="ml-10 rounded-lg bg-muted p-3 text-sm">
                  <p className="font-semibold">Why</p>
                  <p className="mt-1 leading-relaxed text-foreground/90">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          </Card>
        );
      })}

      {/* ------------------------------ Actions ------------------------------ */}
      {!result ? (
        <div className="flex justify-end">
          <Button onClick={submit} disabled={!allAnswered} loading={pending}>
            Check my answers
            <ArrowRight />
          </Button>
        </div>
      ) : (
        <Card
          className={cn(
            "p-6 text-center",
            result.perfect ? "border-success/40 bg-success-soft" : "border-border",
          )}
        >
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-card shadow-card">
            {result.perfect ? (
              <Trophy className="size-7 text-success" />
            ) : (
              <Lightbulb className="size-7 text-primary" />
            )}
          </div>

          <h3 className="mt-3 text-lg font-bold">
            {result.perfect ? "Perfect score!" : `${result.correctCount} of ${result.total} correct`}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.perfect
              ? "You understood every question. Read the explanations anyway — they are where the edge cases live."
              : "Read the explanations above for anything you missed, then try again."}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Badge tone="success">+{result.xpGained} XP</Badge>
            <Badge tone="primary">
              Level {result.level} — {result.levelName}
            </Badge>
            {result.levelUp && <Badge tone="warning">Level up!</Badge>}
          </div>

          {result.achievementKeys.length > 0 && (
            <p className="mt-3 text-sm font-medium text-success">
              🏆 New badge{result.achievementKeys.length > 1 ? "s" : ""} unlocked:{" "}
              {result.achievementKeys.join(", ").replace(/_/g, " ")}
            </p>
          )}

          <div className="mt-5 flex justify-center gap-2">
            <Button variant="outline" onClick={retry}>
              <RotateCcw />
              Try again
            </Button>
            <Button asChild>
              <a href="#lesson-top">
                Back to the top
              </a>
            </Button>
          </div>
        </Card>
      )}
    </section>
  );
}
