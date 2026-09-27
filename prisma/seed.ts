import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/crypto";
import { htmlCourse } from "./seed/html-course";
import { cssCourse } from "./seed/css-course";
import { jsCourse } from "./seed/js-course";
import { challenges } from "./seed/challenges";
import { projects } from "./seed/projects";
import { achievements, paths } from "./seed/achievements";
import { references } from "./seed/reference";
import type { SeedCourse, SeedLessonFull } from "./seed/types";

const prisma = new PrismaClient();

/**
 * Catches authoring mistakes before they reach the database, where they would
 * show up as a lesson with an unanswerable quiz question.
 */
function validateCourse(course: SeedCourse) {
  const errors: string[] = [];
  const slugs = new Set<string>();

  for (const lesson of course.lessons) {
    if (slugs.has(lesson.slug)) errors.push(`${course.slug}: duplicate lesson slug "${lesson.slug}"`);
    slugs.add(lesson.slug);

    if (!lesson.objective.trim()) errors.push(`${lesson.slug}: missing objective`);
    if (lesson.blocks.length === 0) errors.push(`${lesson.slug}: no content blocks`);

    if (lesson.questions.length === 0) errors.push(`${lesson.slug}: no quiz questions`);

    for (const [i, q] of lesson.questions.entries()) {
      const correct = q.options.filter((o) => o.correct).length;
      const label = `${lesson.slug} question ${i + 1}`;

      if (q.options.length < 2) errors.push(`${label}: needs at least 2 options`);
      if (correct === 0) errors.push(`${label}: no option is marked correct`);
      // MULTIPLE_ANSWER legitimately has several; every other type has exactly one.
      if (q.type !== "MULTIPLE_ANSWER" && correct > 1) {
        errors.push(`${label}: ${correct} options marked correct but type is ${q.type}`);
      }
      if (!q.explanation.trim()) errors.push(`${label}: missing explanation`);
    }
  }

  return errors;
}

function validateChallenges() {
  const errors: string[] = [];
  const slugs = new Set<string>();

  for (const c of challenges) {
    if (slugs.has(c.slug)) errors.push(`duplicate challenge slug "${c.slug}"`);
    slugs.add(c.slug);
    if (c.tests.length === 0) errors.push(`${c.slug}: no validation tests`);
    if (c.hints.length === 0) errors.push(`${c.slug}: no hints`);
  }
  return errors;
}

function lessonToRow(lesson: SeedLessonFull, orderIndex: number) {
  return {
    title: lesson.title,
    slug: lesson.slug,
    summary: lesson.summary,
    content: JSON.stringify({ objective: lesson.objective, blocks: lesson.blocks }),
    orderIndex,
    estimatedMinutes: lesson.estimatedMinutes,
    difficulty: lesson.difficulty ?? "BEGINNER",
    published: true,
    isProject: lesson.isProject ?? false,
  };
}

async function seedCourse(course: SeedCourse, orderIndex: number) {
  const record = await prisma.course.upsert({
    where: { slug: course.slug },
    update: {
      title: course.title,
      description: course.description,
      tagline: course.tagline,
      track: course.track,
      icon: course.icon,
      accent: course.accent,
      difficulty: course.difficulty ?? "BEGINNER",
      orderIndex,
    },
    create: {
      title: course.title,
      slug: course.slug,
      description: course.description,
      tagline: course.tagline,
      track: course.track,
      icon: course.icon,
      accent: course.accent,
      difficulty: course.difficulty ?? "BEGINNER",
      orderIndex,
      published: true,
    },
  });

  for (const [i, lesson] of course.lessons.entries()) {
    const lessonRow = await prisma.lesson.upsert({
      where: { courseId_slug: { courseId: record.id, slug: lesson.slug } },
      update: lessonToRow(lesson, i),
      create: { courseId: record.id, ...lessonToRow(lesson, i) },
    });

    // Questions are replaced wholesale so re-seeding cannot duplicate them.
    await prisma.quizQuestion.deleteMany({ where: { lessonId: lessonRow.id } });

    for (const [qi, question] of lesson.questions.entries()) {
      await prisma.quizQuestion.create({
        data: {
          lessonId: lessonRow.id,
          question: question.question,
          type: question.type ?? "MULTIPLE_CHOICE",
          code: question.code ?? null,
          explanation: question.explanation,
          xpReward: question.xpReward ?? 10,
          orderIndex: qi,
          options: {
            create: question.options.map((option, oi) => ({
              optionText: option.text,
              isCorrect: option.correct,
              orderIndex: oi,
            })),
          },
        },
      });
    }
  }

  console.log(`  course "${course.slug}" — ${course.lessons.length} lessons`);
}

async function main() {
  console.log("Validating seed content...");
  const errors = [
    ...validateCourse(htmlCourse),
    ...validateCourse(cssCourse),
    ...validateCourse(jsCourse),
    ...validateChallenges(),
  ];

  if (errors.length > 0) {
    console.error("\nSeed content has errors:\n");
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  console.log("  content OK");

  console.log("Seeding courses...");
  await seedCourse(htmlCourse, 0);
  await seedCourse(cssCourse, 1);
  await seedCourse(jsCourse, 2);

  console.log("Seeding challenges...");
  for (const [i, c] of challenges.entries()) {
    await prisma.challenge.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        description: c.description,
        instructions: c.instructions,
        track: c.track,
        difficulty: c.difficulty ?? "BEGINNER",
        starterCode: JSON.stringify(c.starterCode),
        solution: JSON.stringify(c.solution),
        tests: JSON.stringify(c.tests),
        hints: JSON.stringify(c.hints),
        xpReward: c.xpReward ?? 50,
        orderIndex: i,
      },
      create: {
        title: c.title,
        slug: c.slug,
        description: c.description,
        instructions: c.instructions,
        track: c.track,
        difficulty: c.difficulty ?? "BEGINNER",
        starterCode: JSON.stringify(c.starterCode),
        solution: JSON.stringify(c.solution),
        tests: JSON.stringify(c.tests),
        hints: JSON.stringify(c.hints),
        xpReward: c.xpReward ?? 50,
        orderIndex: i,
        published: true,
      },
    });
  }
  console.log(`  ${challenges.length} challenges`);

  console.log("Seeding projects...");
  for (const [i, p] of projects.entries()) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        description: p.description,
        track: p.track,
        difficulty: p.difficulty ?? "BEGINNER",
        requirements: JSON.stringify(p.requirements),
        checklist: JSON.stringify(p.checklist),
        starterFiles: JSON.stringify(p.starterFiles),
        designReference: JSON.stringify(p.designReference),
        xpReward: p.xpReward ?? 200,
        orderIndex: i,
      },
      create: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        track: p.track,
        difficulty: p.difficulty ?? "BEGINNER",
        requirements: JSON.stringify(p.requirements),
        checklist: JSON.stringify(p.checklist),
        starterFiles: JSON.stringify(p.starterFiles),
        designReference: JSON.stringify(p.designReference),
        xpReward: p.xpReward ?? 200,
        orderIndex: i,
        published: true,
      },
    });
  }
  console.log(`  ${projects.length} projects`);

  console.log("Seeding achievements...");
  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: {
        name: a.name,
        description: a.description,
        icon: a.icon,
        xpReward: a.xpReward,
        criteria: JSON.stringify(a.criteria),
      },
      create: {
        key: a.key,
        name: a.name,
        description: a.description,
        icon: a.icon,
        xpReward: a.xpReward,
        criteria: JSON.stringify(a.criteria),
      },
    });
  }
  console.log(`  ${achievements.length} achievements`);

  console.log("Seeding learning paths...");
  for (const path of paths) {
    const record = await prisma.learningPath.upsert({
      where: { slug: path.slug },
      update: {
        title: path.title,
        description: path.description,
        emoji: path.emoji,
        tier: path.tier ?? "FREE",
      },
      create: {
        slug: path.slug,
        title: path.title,
        description: path.description,
        emoji: path.emoji,
        tier: path.tier ?? "FREE",
      },
    });

    await prisma.learningPathStage.deleteMany({ where: { pathId: record.id } });
    for (const [i, courseSlug] of path.courseSlugs.entries()) {
      const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
      if (!course) continue;
      await prisma.learningPathStage.create({
        data: { pathId: record.id, courseId: course.id, orderIndex: i },
      });
    }
  }
  console.log(`  ${paths.length} paths`);

  console.log("Seeding reference...");
  await prisma.referenceEntry.deleteMany();
  for (const [i, r] of references.entries()) {
    await prisma.referenceEntry.create({
      data: {
        track: r.track,
        title: r.title,
        syntax: r.syntax,
        summary: r.summary,
        example: r.example,
        mistakes: JSON.stringify(r.mistakes),
        keywords: r.keywords,
        orderIndex: i,
      },
    });
  }
  console.log(`  ${references.length} reference entries`);

  console.log("Seeding users...");
  const adminPassword = await hashPassword("admin12345");
  await prisma.user.upsert({
    where: { email: "admin@codelearn.dev" },
    update: { role: "ADMIN", emailVerified: true },
    create: {
      name: "CodeLearn Admin",
      email: "admin@codelearn.dev",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: true,
      verifiedAt: new Date(),
      onboardingDone: true,
      assignedPathId: (await prisma.learningPath.findUnique({ where: { slug: "beginner-frontend" } }))?.id ?? null,
    },
  });

  const demoPassword = await hashPassword("demo12345");
  const demo = await prisma.user.upsert({
    where: { email: "demo@codelearn.dev" },
    update: {},
    create: {
      name: "Alex Kim",
      email: "demo@codelearn.dev",
      passwordHash: demoPassword,
      emailVerified: true,
      verifiedAt: new Date(),
      onboardingDone: true,
      bio: "Learning to build things for the web.",
      dailyGoalMinutes: 30,
      assignedPathId: (await prisma.learningPath.findUnique({ where: { slug: "beginner-frontend" } }))?.id ?? null,
    },
  });

  // Give the demo account some real history so the dashboard is not empty on
  // first login. Idempotent: skipped if progress already exists.
  const existingProgress = await prisma.userProgress.count({ where: { userId: demo.id } });
  if (existingProgress === 0) {
    const htmlCourseRow = await prisma.course.findUniqueOrThrow({ where: { slug: "html" } });
    const cssCourseRow = await prisma.course.findUniqueOrThrow({ where: { slug: "css" } });

    const htmlLessons = await prisma.lesson.findMany({
      where: { courseId: htmlCourseRow.id },
      orderBy: { orderIndex: "asc" },
    });
    const cssLessons = await prisma.lesson.findMany({
      where: { courseId: cssCourseRow.id },
      orderBy: { orderIndex: "asc" },
    });

    const completedHtml = htmlLessons.slice(0, 9);
    const completedCss = cssLessons.slice(0, 3);

    for (const lesson of completedHtml) {
      await prisma.userProgress.create({
        data: {
          userId: demo.id,
          courseId: htmlCourseRow.id,
          lessonId: lesson.id,
          completed: true,
          completedAt: new Date(),
          secondsSpent: lesson.estimatedMinutes * 60,
        },
      });
    }
    for (const lesson of completedCss) {
      await prisma.userProgress.create({
        data: {
          userId: demo.id,
          courseId: cssCourseRow.id,
          lessonId: lesson.id,
          completed: true,
          completedAt: new Date(),
          secondsSpent: lesson.estimatedMinutes * 60,
        },
      });
    }

    // XP consistent with the seeded progress.
    const xp = completedHtml.length * 20 + completedCss.length * 20 + 30;
    await prisma.user.update({
      where: { id: demo.id },
      data: { xp, level: xp >= 500 ? 2 : 1, streak: 4, longestStreak: 4 },
    });
    await prisma.xpEvent.createMany({
      data: [
        ...completedHtml.map(() => ({
          userId: demo.id,
          reason: "LESSON",
          amount: 20,
          createdAt: new Date(Date.now() - 4 * 86_400_000),
        })),
        { userId: demo.id, reason: "QUIZ", amount: 30, createdAt: new Date() },
      ],
    });

    for (let d = 0; d < 4; d++) {
      const date = new Date(Date.now() - d * 86_400_000).toISOString().slice(0, 10);
      await prisma.dailyActivity.create({
        data: {
          userId: demo.id,
          date,
          xpEarned: 20,
          secondsLearned: 600,
          activitiesCount: 1,
          goalMet: d === 0,
        },
      });
    }

    await prisma.userAchievement.createMany({
      data: [
        { userId: demo.id, achievementId: (await prisma.achievement.findUniqueOrThrow({ where: { key: "first_lesson" } })).id },
        { userId: demo.id, achievementId: (await prisma.achievement.findUniqueOrThrow({ where: { key: "five_lessons" } })).id },
        { userId: demo.id, achievementId: (await prisma.achievement.findUniqueOrThrow({ where: { key: "streak_3" } })).id },
      ],
    });

    await prisma.challengeSubmission.create({
      data: {
        userId: demo.id,
        challengeId: (await prisma.challenge.findUniqueOrThrow({ where: { slug: "semantic-profile-card" } })).id,
        code: JSON.stringify({
          html: '<article><h2>Alex</h2><img src="a.jpg" alt="Portrait"><p>Hi</p><ul><li>HTML</li><li>CSS</li><li>JS</li></ul></article>',
          css: "",
          js: "",
        }),
        passed: true,
        results: JSON.stringify([]),
        submittedAt: new Date(Date.now() - 86_400_000),
      },
    });

    await prisma.notification.create({
      data: {
        userId: demo.id,
        type: "WELCOME",
        title: "Welcome to CodeLearn",
        body: "Your progress is saved automatically. Pick up where you left off any time.",
        href: "/dashboard",
      },
    });

    console.log("  demo user given sample progress");
  }

  console.log("\nSeed complete.");
  console.log("  admin@codelearn.dev / admin12345");
  console.log("  demo@codelearn.dev  / demo12345");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
