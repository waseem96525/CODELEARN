import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/session";
import { AppShell } from "@/components/app-shell";

/**
 * Every page under this layout is behind a server-side session check.
 * `requireUser` reads the DB-backed session on the server and redirects if it
 * is missing or expired — the client is never trusted for this.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return (
    <AppShell
      user={{
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        isAdmin: user.role === "ADMIN",
      }}
    >
      {children}
    </AppShell>
  );
}
