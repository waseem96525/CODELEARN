"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, getCurrentUser } from "@/lib/auth/session";
import { hashPassword, verifyPassword, generateToken } from "@/lib/auth/crypto";
import { firstError, loginSchema, signupSchema } from "@/lib/auth/validation";
import { recordActivity, XP_REWARDS } from "@/lib/gamification";
import { checkAchievements } from "@/lib/achievements";
import { notify } from "@/lib/notifications";
import type { ActionState } from "@/lib/action-state";

function safeNext(next: unknown): string {
  // Only allow same-origin relative paths — blocks open-redirect via ?next=
  if (typeof next !== "string") return "/dashboard";
  if (!next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

export async function signupAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: firstError(parsed.error), fields: { email: String(formData.get("email") ?? "") } };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists. Try logging in." };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      // No mail transport is wired up in this build, so accounts start verified.
      // Swap this for a token round-trip before enabling real signups.
      emailVerified: true,
      verifiedAt: new Date(),
    },
  });

  await createSession(user.id);
  // First-day bonus so opening the app already feels rewarding.
  await recordActivity(user.id, { reason: "DAILY_LOGIN", amount: XP_REWARDS.DAILY_LOGIN });
  await notify(
    user.id,
    "WELCOME",
    "Welcome to CodeLearn",
    "Start with the HTML course — it takes about 10 minutes to get your first win.",
    "/learn/html/html-introduction",
  );

  redirect("/onboarding");
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: firstError(parsed.error) };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always run a hash comparison so a missing account and a wrong password
  // take the same amount of time (no user enumeration via response latency).
  const stored = user?.passwordHash ?? DUMMY_HASH;
  const ok = await verifyPassword(password, stored);

  if (!user || !ok) {
    return { error: "Incorrect email or password." };
  }

  await createSession(user.id);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await recordActivity(user.id, { reason: "DAILY_LOGIN", amount: XP_REWARDS.DAILY_LOGIN });

  if (!user.onboardingDone) redirect("/onboarding");
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

export async function requestPasswordResetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  // Always report success: revealing which emails exist is an information leak.
  if (user) {
    const token = generateToken(24);
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    // No SMTP configured. In production email this link; the token is stored
    // either way so the reset flow is testable end to end.
    console.info(`[codelearn] password reset token for ${email}: ${token}`);
  }

  return { success: "If that email exists, a reset link is on its way." };
}

export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) return { error: "Password must be at least 8 characters" };

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { error: "This reset link is invalid or has expired." };
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: record.userId } });
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(password) },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    // A password change invalidates every existing session.
    prisma.session.deleteMany({ where: { userId: user.id } }),
  ]);

  await createSession(user.id);
  redirect("/dashboard?reset=1");
}

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You need to be signed in." };

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");

  if (next.length < 8) return { error: "New password must be at least 8 characters" };

  const record = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
  if (!(await verifyPassword(current, record.passwordHash))) {
    return { error: "Current password is incorrect." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(next) },
  });
  revalidatePath("/settings");
  return { success: "Password updated." };
}

// A valid hash of a random string, used only to equalise timing on failed logins.
const DUMMY_HASH =
  "scrypt$16384$8$1$00000000000000000000000000000000$" +
  "0000000000000000000000000000000000000000000000000000000000000000" +
  "0000000000000000000000000000000000000000000000000000000000000000";
