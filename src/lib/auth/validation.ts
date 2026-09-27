import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200, "Password is too long")
    .regex(/[a-zA-Z]/, "Password needs at least one letter")
    .regex(/[0-9]/, "Password needs at least one number"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10, "Invalid reset link"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password needs at least one letter")
    .regex(/[0-9]/, "Password needs at least one number"),
});

export const onboardingSchema = z.object({
  experience: z.enum(["COMPLETE_BEGINNER", "SOME_EXPERIENCE", "INTERMEDIATE"]),
  goal: z.enum([
    "BUILD_WEBSITES",
    "BECOME_FRONTEND_DEV",
    "LEARN_JAVASCRIPT",
    "BUILD_PROJECTS",
    "PREPARE_FOR_JOBS",
  ]),
  dailyGoalMinutes: z.coerce.number().int().min(10).max(120),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(50),
  bio: z.string().trim().max(280).optional(),
  dailyGoalMinutes: z.coerce.number().int().min(10).max(120),
  editorTheme: z.enum(["light", "dark", "system"]),
});

export const settingsSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  dailyGoalMinutes: z.coerce.number().int().min(10).max(120),
  editorTheme: z.enum(["light", "dark", "system"]),
  notifyLessons: z.boolean(),
  notifyStreaks: z.boolean(),
  notifyBadges: z.boolean(),
  notifyProjects: z.boolean(),
  notifyMarketing: z.boolean(),
  reduceMotion: z.boolean(),
});

export const noteSchema = z.object({
  lessonId: z.string().min(1),
  content: z.string().trim().min(1, "Note cannot be empty").max(5000),
});

export const challengeSubmissionSchema = z.object({
  challengeId: z.string().min(1),
  code: z.object({
    html: z.string().max(200_000),
    css: z.string().max(200_000),
    js: z.string().max(200_000),
  }),
  results: z.array(
    z.object({
      label: z.string().max(300),
      passed: z.boolean(),
      detail: z.string().max(1000),
    }),
  ).max(50),
  hintsUsed: z.coerce.number().int().min(0).max(10),
});

export const projectSaveSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().trim().min(1).max(80),
  files: z.record(z.string(), z.string().max(300_000)),
  checklist: z.array(z.number().int().min(0)).max(50),
  completed: z.boolean().default(false),
});

export const quizGradeSchema = z.object({
  lessonId: z.string().min(1),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      optionIds: z.array(z.string().min(1)).min(1).max(8),
    }),
  ).min(1).max(40),
});

export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Something went wrong";
}
