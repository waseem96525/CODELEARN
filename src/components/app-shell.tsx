"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Bookmark,
  BookOpen,
  Code,
  Code2,
  Compass,
  FolderGit2,
  Home,
  LayoutDashboard,
  NotebookPen,
  Settings,
  Shield,
  Swords,
  User,
} from "lucide-react";
import { cn, initialsOf } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "./logout-button";
import { LevelPill } from "./level-pill";

export interface NavUser {
  name: string;
  email: string;
  avatar: string | null;
  level: number;
  xp: number;
  streak: number;
  isAdmin: boolean;
}

const PRIMARY = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/roadmap", label: "Roadmap", icon: Compass },
  { href: "/practice", label: "Practice", icon: Swords },
  { href: "/projects", label: "Projects", icon: FolderGit2 },
  { href: "/playground", label: "Playground", icon: Code },
] as const;

const SECONDARY = [
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/notes", label: "Notes", icon: NotebookPen },
  { href: "/achievements", label: "Achievements", icon: Award },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

const MOBILE = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Swords },
  { href: "/projects", label: "Projects", icon: FolderGit2 },
  { href: "/profile", label: "Profile", icon: User },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({
  user,
  children,
}: {
  user: NavUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ---------------------------- Sidebar (desktop) ---------------------------- */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-14 items-center px-5">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Code2 className="size-4" />
            </span>
            CodeLearn
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2" aria-label="Main">
          {PRIMARY.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}

          <div className="my-3 h-px bg-sidebar-border" />

          {SECONDARY.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}

          {user.isAdmin && (
            <>
              <div className="my-3 h-px bg-sidebar-border" />
              <Link
                href="/admin"
                aria-current={isActive(pathname, "/admin") ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(pathname, "/admin")
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Shield className="size-4 shrink-0" />
                Admin
              </Link>
            </>
          )}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2.5 rounded-lg p-2">
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
            >
              {initialsOf(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight">{user.name}</p>
              <LevelPill level={user.level} xp={user.xp} className="text-[11px]" />
            </div>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <ThemeToggle className="flex-1 justify-start" />
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* ------------------------------ Main column ------------------------------ */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold lg:hidden">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Code2 className="size-4" />
            </span>
            <span className="hidden sm:inline">CodeLearn</span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold sm:inline-flex">
              <span aria-hidden>🔥</span>
              {user.streak}
              <span className="font-normal text-muted-foreground">
                day{user.streak === 1 ? "" : "s"}
              </span>
            </span>
            <ThemeToggle />
            <Link
              href="/profile"
              className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
              aria-label="Your profile"
            >
              {initialsOf(user.name)}
            </Link>
          </div>
        </header>

        <main id="main-content" className="min-w-0 flex-1 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* --------------------------- Bottom nav (mobile) --------------------------- */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-background/95 backdrop-blur lg:hidden"
        aria-label="Mobile"
      >
        {MOBILE.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export { LayoutDashboard };
