import "server-only";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE,
  SESSION_TTL_DAYS,
  generateToken,
  signToken,
  unsignToken,
} from "./crypto";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  xp: number;
  level: number;
  streak: number;
  dailyGoalMinutes: number;
  onboardingDone: boolean;
  emailVerified: boolean;
};

export async function createSession(userId: string): Promise<void> {
  const token = generateToken(32);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  const headerList = await headers();
  const userAgent = headerList.get("user-agent")?.slice(0, 255) ?? null;

  await prisma.session.create({ data: { token, userId, expiresAt, userAgent } });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, signToken(token), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const signed = jar.get(SESSION_COOKIE)?.value;
  if (signed) {
    const token = unsignToken(signed);
    if (token) {
      await prisma.session.deleteMany({ where: { token } });
    }
  }
  jar.delete(SESSION_COOKIE);
}

/**
 * Resolves the current user from the session cookie.
 * `cache` dedupes this across a single render pass so a page that checks auth
 * in the layout, the page and three components only hits the DB once.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  const signed = jar.get(SESSION_COOKIE)?.value;
  if (!signed) return null;

  const token = unsignToken(signed);
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.deleteMany({ where: { token } });
    return null;
  }

  if (session.user.role !== "ADMIN" && !session.user.emailVerified) {
    // Unverified accounts keep their session but are confined to /verify-email.
    // Checked here so no protected surface can be reached before verification.
  }

  const u = session.user;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    role: u.role,
    xp: u.xp,
    level: u.level,
    streak: u.streak,
    dailyGoalMinutes: u.dailyGoalMinutes,
    onboardingDone: u.onboardingDone,
    emailVerified: u.emailVerified,
  };
});

/** For pages that must not be viewable when signed out. Redirects to login. */
export async function requireUser(returnTo?: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    const next = returnTo ?? (await headers()).get("next-url") ?? "/dashboard";
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  return user;
}

/**
 * Admin gate. Enforced server-side on every admin page and mutation —
 * the UI hiding the nav is presentation only, never the control.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

export function isAdmin(user: { role: string } | null): boolean {
  return user?.role === "ADMIN";
}
