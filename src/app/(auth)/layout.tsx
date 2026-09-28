import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Code2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to CodeLearn to continue your learning path.",
  robots: { index: false, follow: false },
};

export default async function AuthLayout({ children }: { children: ReactNode }) {
  // Already signed in? Skip the form.
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Code2 className="size-4" />
          </span>
          CodeLearn
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>

      <footer className="px-4 py-6 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          &larr; Back to home
        </Link>
      </footer>
    </div>
  );
}
