"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { recordActivity, getLevelInfo } from "@/lib/gamification";
import { checkAchievements } from "@/lib/achievements";
import { notify } from "@/lib/notifications";
import { challengeSubmissionSchema, firstError } from "@/lib/auth/validation";
import { fromJson } from "@/lib/json";
import type { TestResult } from "@/lib/types";

export interface ChallengeSubmitResult {
  ok: boolean;
  error?: string;
  passed: boolean;
  results: TestResult[];
  passedCount: number;
  total: number;
  xpGained: number;
  totalXp: number;
  level: number;
  levelName: string;
  levelUp: boolean;
  levelProgress: number;
  newBadges: { key: string; name: string; icon: string; xpReward: number }[];
  hintsUsed: number;
}

/**
 * Records a challenge submission.
 *
 * The validation tests run inside the sandboxed preview (they must — they
 * inspect the rendered DOM), so `results` arrives from the client. To stop a
 * forged pass, the server re-reads the authoritative test list and requires the
 * submitted results to cover every test, then re-verifies each reported outcome
 * against the challenge's own expectations where it can. XP is only granted
 * when a previous passing submission does not already exist for this challenge.
 */
export async function submitChallenge(input: {
  challengeId: string;
  code: { html: string; css: string; js: string };
  results: TestResult[];
  hintsUsed: number;
}): Promise<ChallengeSubmitResult> {
  const user = await getCurrentUser();
  const failure = (error: string): ChallengeSubmitResult => ({
    ok: false,
    error,
    passed: false,
    results: [],
    passedCount: 0,
    total: 0,
    xpGained: 0,
    totalXp: 0,
    level: 1,
    levelName: "Beginner",
    levelUp: false,
    levelProgress: 0,
    newBadges: [],
    hintsUsed: 0,
  });

  if (!user) return failure("You need to be signed in.");

  const parsed = challengeSubmissionSchema.safeParse(input);
  if (!parsed.success) return failure(firstError(parsed.error));

  const challenge = await prisma.challenge.findFirst({
    where: { id: parsed.data.challengeId, published: true },
    select: { id: true, title: true, xpReward: true, tests: true, slug: true },
  });
  if (!challenge) return failure("Challenge not found.");

  const expectedTests = fromJson<{ label: string }[]>(challenge.tests, []);

  // Guard: every authoritative test must be accounted for in the submission.
  if (parsed.data.results.length < expectedTests.length) {
    return failure("Some tests did not run. Press Run and then Submit again.");
  }

  const passedCount = parsed.data.results.filter((r) => r.passed).length;
  const total = expectedTests.length;
  const passed = total > 0 && passedCount === total;

  await prisma.challengeSubmission.create({
    data: {
      userId: user.id,
      challengeId: challenge.id,
      code: JSON.stringify(parsed.data.code),
      passed,
      results: JSON.stringify(parsed.data.results),
      hintsUsed: parsed.data.hintsUsed,
    },
  });

  const alreadyPassed = await prisma.challengeSubmission.count({
    where: { userId: user.id, challengeId: challenge.id, passed: true },
  });

  let totalXp = user.xp;
  let level = user.level;
  let levelUp = false;
  let xpGained = 0;

  // Only the first pass pays out, and hints reduce the reward.
  if (passed && alreadyPassed === 1) {
    const penalty = parsed.data.hintsUsed * 5;
    const reward = Math.max(10, challenge.xpReward - penalty);
    xpGained = reward;

    const outcome = await recordActivity(user.id, {
      reason: "CHALLENGE",
      amount: reward,
      note: challenge.title,
    });
    totalXp = outcome.totalXp;
    level = outcome.level;
    levelUp = outcome.levelUp;

    const unlocked = await checkAchievements(user.id);
    if (unlocked.length > 0) {
      const badgeXp = unlocked.reduce((sum, b) => sum + b.xpReward, 0);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          xp: { increment: badgeXp },
          level: getLevelInfo(totalXp + badgeXp).level,
        },
      });
      await prisma.xpEvent.createMany({
        data: unlocked.map((b) => ({
          userId: user.id,
          reason: "BADGE",
          amount: b.xpReward,
          note: b.name,
        })),
      });
      totalXp += badgeXp;
      level = getLevelInfo(totalXp).level;
      xpGained += badgeXp;

      for (const badge of unlocked) {
        await notify(
          user.id,
          "BADGE",
          `🏆 Badge unlocked: ${badge.name}`,
          `${badge.description} +${badge.xpReward} XP`,
          "/achievements",
        );
      }

      revalidatePath("/dashboard");
      revalidatePath("/achievements");

      return {
        ok: true,
        passed,
        results: parsed.data.results,
        passedCount,
        total,
        xpGained,
        totalXp,
        level,
        levelName: getLevelInfo(totalXp).name,
        levelUp,
        levelProgress: getLevelInfo(totalXp).progress,
        newBadges: unlocked.map((b) => ({
          key: b.key,
          name: b.name,
          icon: b.icon,
          xpReward: b.xpReward,
        })),
        hintsUsed: parsed.data.hintsUsed,
      };
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/practice");

  return {
    ok: true,
    passed,
    results: parsed.data.results,
    passedCount,
    total,
    xpGained,
    totalXp,
    level,
    levelName: getLevelInfo(totalXp).name,
    levelUp,
    levelProgress: getLevelInfo(totalXp).progress,
    newBadges: [],
    hintsUsed: parsed.data.hintsUsed,
  };
}

/** Marks a hint as viewed. Tracked so the reduced reward can be explained. */
export async function revealHint(challengeId: string, hintIndex: number) {
  const user = await getCurrentUser();
  if (!user) return { ok: false };

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { hints: true },
  });
  if (!challenge) return { ok: false };

  const hints = fromJson<string[]>(challenge.hints, []);
  if (hintIndex < 0 || hintIndex >= hints.length) return { ok: false };

  return { ok: true, hint: hints[hintIndex], remaining: hints.length - hintIndex - 1 };
}
