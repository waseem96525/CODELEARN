"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { completeOnboarding } from "@/app/(app)/actions/onboarding";
import { EXPERIENCE_OPTIONS, GOAL_OPTIONS } from "@/lib/types";
import type { ExperienceLevel, LearningGoal } from "@/lib/types";
import { cn } from "@/lib/utils";

const DAILY_GOALS = [10, 20, 30, 60];

const GOAL_LABELS: Record<LearningGoal, string> = {
  BUILD_WEBSITES: "Build Websites",
  BECOME_FRONTEND_DEV: "Become a Frontend Developer",
  LEARN_JAVASCRIPT: "Learn JavaScript",
  BUILD_PROJECTS: "Build Projects",
  PREPARE_FOR_JOBS: "Prepare for Jobs",
};

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [experience, setExperience] = React.useState<ExperienceLevel | null>(null);
  const [goal, setGoal] = React.useState<LearningGoal | null>(null);
  const [dailyGoalMinutes, setDailyGoalMinutes] = React.useState(30);
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const canAdvance = step === 0 ? experience !== null : step === 1 ? goal !== null : true;
  const isLast = step === 2;

  function submit() {
    if (!experience || !goal) return;
    setError(null);

    startTransition(async () => {
      try {
        await completeOnboarding({ experience, goal, dailyGoalMinutes });
        // completeOnboarding redirects, so this only runs if that failed.
        router.refresh();
      } catch {
        setError("Something went wrong saving your preferences. Please try again.");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="space-y-2 text-center">
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <Sparkles className="size-4" />
          Welcome to CodeLearn
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Let&apos;s set up your path</h1>
        <p className="text-muted-foreground">
          Three quick questions so we can send you to the right starting lesson.
        </p>
      </div>

      <div className="space-y-2">
        <Progress value={((step + 1) / 3) * 100} label="Onboarding progress" />
        <p className="text-center text-xs text-muted-foreground">
          Step {step + 1} of 3
        </p>
      </div>

      <Card className="p-6">
        {step === 0 && (
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">What is your coding experience?</legend>
            <p className="text-sm text-muted-foreground">
              This only affects where we start you. You can change it later.
            </p>
            <div className="space-y-2">
              {EXPERIENCE_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  title={option.label}
                  description={option.description}
                  selected={experience === option.value}
                  onSelect={() => setExperience(option.value)}
                />
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">What do you want to learn?</legend>
            <p className="text-sm text-muted-foreground">
              We will recommend a path that matches.
            </p>
            <div className="space-y-2">
              {GOAL_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  title={option.label}
                  description={option.description}
                  selected={goal === option.value}
                  onSelect={() => setGoal(option.value)}
                />
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">
              How much time can you study each day?
            </legend>
            <p className="text-sm text-muted-foreground">
              You can change this whenever you like. Short and consistent beats long and
              sporadic.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DAILY_GOALS.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => setDailyGoalMinutes(minutes)}
                  aria-pressed={dailyGoalMinutes === minutes}
                  className={cn(
                    "rounded-xl border p-4 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    dailyGoalMinutes === minutes
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <span className="block text-2xl font-bold">{minutes}</span>
                  <span className="text-xs text-muted-foreground">minutes</span>
                </button>
              ))}
            </div>

            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium">Your recommended path</p>
              <p className="mt-1 text-muted-foreground">
                Based on {experience ? EXPERIENCE_OPTIONS.find((o) => o.value === experience)?.label.toLowerCase() : "your experience"}{" "}
                and a goal of {goal ? GOAL_LABELS[goal].toLowerCase() : "building things"},
                we will start you on the{" "}
                <span className="font-semibold text-foreground">
                  {goal === "LEARN_JAVASCRIPT" || (experience === "INTERMEDIATE" && goal === "BECOME_FRONTEND_DEV")
                    ? "JavaScript Developer"
                    : goal === "BUILD_WEBSITES" || goal === "BUILD_PROJECTS"
                      ? "HTML & CSS Foundations"
                      : "Beginner Frontend Developer"}
                </span>{" "}
                path. You can switch paths any time from settings.
              </p>
            </div>
          </fieldset>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || pending}
          >
            <ArrowLeft />
            Back
          </Button>

          {isLast ? (
            <Button type="button" onClick={submit} disabled={pending} loading={pending}>
              Start learning
              <ArrowRight />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance}
            >
              Continue
              <ArrowRight />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function OptionCard({
  title,
  description,
  selected,
  onSelect,
}: {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        selected ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-primary bg-primary text-primary-foreground" : "border-input",
        )}
      >
        {selected && <Check className="size-3" />}
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{description}</span>
      </span>
    </button>
  );
}
