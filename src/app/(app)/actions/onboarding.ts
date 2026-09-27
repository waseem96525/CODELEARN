"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { onboardingSchema, firstError } from "@/lib/auth/validation";
import { notify } from "@/lib/notifications";
import type { LearningGoal, ExperienceLevel } from "@/lib/types";

/**
 * Maps onboarding answers to a learning path.
 *
 * Kept as an explicit table rather than a scoring heuristic so the recommendation
 * is predictable and easy to explain to the user.
 */
function recommendPath(
  experience: ExperienceLevel,
  goal: LearningGoal,
): { slug: string; reason: string } {
  if (goal === "LEARN_JAVASCRIPT") {
    return {
      slug: "javascript-developer",
      reason: "You want to focus on JavaScript, so we start with the programming fundamentals path.",
    };
  }

  if (experience === "INTERMEDIATE" && goal === "BECOME_FRONTEND_DEV") {
    return {
      slug: "javascript-developer",
      reason: "You already know the basics, so the JavaScript Developer path will move fastest.",
    };
  }

  if (goal === "BUILD_WEBSITES" || goal === "BUILD_PROJECTS") {
    return {
      slug: "html-css-foundations",
      reason: "To start building and publishing sites quickly, focus on HTML and CSS first.",
    };
  }

  return {
    slug: "beginner-frontend",
    reason: "This is the full beginner route: HTML, then CSS, then JavaScript, in that order.",
  };
}

export async function completeOnboarding(input: {
  experience: ExperienceLevel;
  goal: LearningGoal;
  dailyGoalMinutes: number;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: firstError(parsed.error) } as const;
  }

  const { experience, goal, dailyGoalMinutes } = parsed.data;
  const recommendation = recommendPath(experience, goal);

  const path = await prisma.learningPath.findUnique({
    where: { slug: recommendation.slug },
    select: { id: true, title: true, slug: true },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboardingDone: true,
      onboardingData: JSON.stringify({ experience, goal, dailyGoalMinutes }),
      dailyGoalMinutes,
      assignedPathId: path?.id ?? null,
    },
  });

  if (path) {
    await notify(
      user.id,
      "WELCOME",
      "Your learning path is ready",
      recommendation.reason,
      "/roadmap",
    );
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?welcome=1");
}

/** Lets a user switch learning paths later from settings. */
export async function setLearningPath(pathId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const path = await prisma.learningPath.findUnique({
    where: { id: pathId },
    select: { id: true },
  });
  if (!path) return { ok: false, error: "Path not found." };

  await prisma.user.update({
    where: { id: user.id },
    data: { assignedPathId: path.id },
  });

  revalidatePath("/roadmap");
  revalidatePath("/dashboard");
  return { ok: true };
}
