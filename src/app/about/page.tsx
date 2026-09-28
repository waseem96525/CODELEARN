import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Code2, FlaskConical, Swords, Trophy } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why CodeLearn exists, how the Learn–Practice–Build loop works, and what it is built with.",
};

const STATS = [
  { value: "3", label: "Courses: HTML, CSS, JavaScript" },
  { value: "42", label: "Hands-on lessons" },
  { value: "9", label: "Coding challenges with tests" },
  { value: "6", label: "Multi-file projects" },
  { value: "25", label: "Quick-reference entries" },
];

const LOOP = [
  {
    icon: BookOpen,
    step: "01",
    title: "Learn",
    text: "Short lessons that explain one idea at a time, each with a live editor on the page so you try it immediately.",
  },
  {
    icon: Swords,
    step: "02",
    title: "Practice",
    text: "Challenges with automated DOM tests and progressive hints. The tests tell you exactly what is missing.",
  },
  {
    icon: Code2,
    step: "03",
    title: "Build",
    text: "Real projects with requirements, a design reference and a checklist — the closest thing to a first job ticket.",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Track",
    text: "XP, levels, streaks and badges make consistency visible, and certificates prove what you finished.",
  },
];

const PRINCIPLES = [
  {
    icon: FlaskConical,
    title: "Experiment freely",
    text: "Your code runs in a sandboxed frame with no access to the app or your session. Break things — that is the fastest way to learn.",
  },
  {
    icon: BookOpen,
    title: "Content is data",
    text: "Courses, challenges, projects and badges live in the database, not in code. Adding a lesson is a content change, so the curriculum keeps growing.",
  },
  {
    icon: Trophy,
    title: "Progress is real",
    text: "Completions, XP and streaks are stored server-side and validated before they count. No client-side cheating the tests.",
  },
];

export default async function AboutPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Badge tone="info">About CodeLearn</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            You learn to code by writing code
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            No setup, no slideshows, no tutorial hell. CodeLearn puts a real editor in
            front of you from lesson one and keeps you in a loop of learning, practicing
            and building until it sticks.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild>
              <Link href={user ? "/dashboard" : "/signup"}>
                {user ? "Go to dashboard" : "Start learning free"}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/learn">Explore courses</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-5">
          {STATS.map((stat) => (
            <Card key={stat.label} className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold tracking-tight">How it works</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
            One loop, repeated until it sticks. Every part of CodeLearn exists to move
            you through this cycle.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOOP.map((item) => (
              <Card key={item.step} className="p-5">
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <item.icon className="size-5" aria-hidden />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{item.step}</span>
                </div>
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            What makes it different
          </h2>
          <div className="mx-auto mt-6 grid max-w-4xl gap-4 md:grid-cols-3">
            {PRINCIPLES.map((item) => (
              <Card key={item.title} className="p-5">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <Card className="mx-auto mt-16 max-w-3xl p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Your first lesson takes ten minutes
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Create an account and you will be writing HTML in a real editor before you
            have finished your coffee.
          </p>
          <Button asChild className="mt-5">
            <Link href={user ? "/dashboard" : "/signup"}>Create free account</Link>
          </Button>
        </Card>
      </main>

      <SiteFooter />
    </div>
  );
}
