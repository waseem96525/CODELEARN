"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { XP_REWARDS, recordActivity, getLevelInfo } from "@/lib/gamification";
import { checkAchievements } from "@/lib/achievements";
import { notify } from "@/lib/notifications";
import { quizGradeSchema, firstError } from "@/lib/auth/validation";

export interface GradedQuestion {
  questionId: string;
  correct: boolean;
  correctOptionIds: string[];
  explanation: string;
  xpReward: number;
}

export interface QuizResult {
  ok: boolean;
  error?: string;
  score: number;
  total: number;
  percent: number;
  correctCount: number;
  xpGained: number;
  totalXp: number;
  level: number;
  levelName: string;
  levelUp: boolean;
  perfect: boolean;
  achievementKeys: string[];
}

/**
 * Grades a quiz submission.
 *
 * Correct answers are looked up from the database and compared server-side —
 * the client only ever submits which option ids were picked, so the score cannot
 * be forged by tampering with the request.
 */
export async function gradeQuiz(
  lessonId: string,
  answers: { questionId: string; optionIds: string[] }[],
): Promise<QuizResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      error: "You need to be signed in.",
      score: 0,
      total: 0,
      percent: 0,
      correctCount: 0,
      xpGained: 0,
      totalXp: 0,
      level: 1,
      levelName: "Beginner",
      levelUp: false,
      perfect: false,
      achievementKeys: [],
    };
  }

  const parsed = quizGradeSchema.safeParse({ lessonId, answers });
  if (!parsed.success) {
    return {
      ok: false,
      error: firstError(parsed.error),
      score: 0,
      total: 0,
      percent: 0,
      correctCount: 0,
      xpGained: 0,
      totalXp: 0,
      level: user.level,
      levelName: "Unknown",
      levelUp: false,
      perfect: false,
      achievementKeys: [],
    };
  }

  const questions = await prisma.quizQuestion.findMany({
    where: { lessonId, lesson: { course: { published: true } } },
    include: { options: true },
  });

  if (questions.length === 0) {
    return {
      ok: false,
      error: "This lesson has no quiz.",
      score: 0,
      total: 0,
      percent: 0,
      correctCount: 0,
      xpGained: 0,
      totalXp: user.xp,
      level: user.level,
      levelName: "Unknown",
      levelUp: false,
      perfect: false,
      achievementKeys: [],
    };
  }

  const answerMap = new Map(parsed.data.answers.map((a) => [a.questionId, new Set(a.optionIds)]));

  let correctCount = 0;
  let xp = 0;
  const graded: GradedQuestion[] = [];

  for (const question of questions) {
    const correctIds = question.options.filter((o) => o.isCorrect).map((o) => o.id);
    const given = answerMap.get(question.id) ?? new Set<string>();

    // Exactly the right set: no missing correct options, no extra wrong ones.
    const isCorrect =
      correctIds.length > 0 &&
      correctIds.length === given.size &&
      correctIds.every((id) => given.has(id));

    if (isCorrect) {
      correctCount += 1;
      xp += question.xpReward;
    }

    graded.push({
      questionId: question.id,
      correct: isCorrect,
      correctOptionIds: correctIds,
      explanation: question.explanation ?? "",
      xpReward: question.xpReward,
    });
  }

  const total = questions.length;
  const percent = Math.round((correctCount / total) * 100);
  const perfect = correctCount === total;

  // One attempt is recorded per question so achievements can count distinct
  // perfect questions without double counting repeated submissions.
  // The previous attempt is read *before* replacing it, so the perfect bonus
  // can be granted only the first time every question in this lesson is right.
  const questionIds = questions.map((q) => q.id);
  const previouslyPerfect =
    (await prisma.quizAttempt.count({
      where: { userId: user.id, questionId: { in: questionIds }, correct: true },
    })) === total;

  await prisma.quizAttempt.deleteMany({ where: { userId: user.id, questionId: { in: questionIds } } });
  await prisma.quizAttempt.createMany({
    data: questions.map((question, i) => {
      const g = graded[i];
      return {
        userId: user.id,
        questionId: question.id,
        score: g.correct ? 1 : 0,
        total: 1,
        correct: g.correct,
        givenOptionIds: JSON.stringify([...(answerMap.get(question.id) ?? [])]),
        xpEarned: g.correct ? question.xpReward : 0,
      };
    }),
  });

  let totalXp = user.xp;
  let level = user.level;
  let levelUp = false;

  if (xp > 0) {
    const outcome = await recordActivity(user.id, {
      reason: "QUIZ",
      amount: XP_REWARDS.QUIZ + xp,
      note: `Quiz: ${correctCount}/${total} correct`,
    });
    totalXp = outcome.totalXp;
    level = outcome.level;
    levelUp = outcome.levelUp;
  }

  // Perfect bonus, granted at most once per lesson.
  if (perfect && !previouslyPerfect) {
    const outcome = await recordActivity(user.id, {
      reason: "PERFECT_QUIZ",
      amount: XP_REWARDS.PERFECT_QUIZ,
      note: "Perfect quiz bonus",
    });
    totalXp = outcome.totalXp;
    level = outcome.level;
    levelUp = levelUp || outcome.levelUp;
  }

  const unlocked = await checkAchievements(user.id);
  if (unlocked.length > 0) {
    const badgeXp = unlocked.reduce((sum, b) => sum + b.xpReward, 0);
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: badgeXp }, level: getLevelInfo(totalXp + badgeXp).level },
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

    for (const badge of unlocked) {
      await notify(
        user.id,
        "BADGE",
        `🏆 Badge unlocked: ${badge.name}`,
        `${badge.description} +${badge.xpReward} XP`,
        "/achievements",
      );
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/achievements");

  return {
    ok: true,
    score: correctCount,
    total,
    percent,
    correctCount,
    xpGained: totalXp - user.xp,
    totalXp,
    level,
    levelName: getLevelInfo(totalXp).name,
    levelUp,
    perfect,
    achievementKeys: unlocked.map((a) => a.key),
  };
}
