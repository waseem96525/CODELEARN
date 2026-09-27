import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { getCourses } from "@/lib/queries";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { HeroPlayground } from "@/components/landing/hero-playground";
import { Card } from "@/components/ui/card";
import { TrackIcon } from "@/components/track-icon";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Flame,
  Rocket,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";

const TOPICS: Record<string, string[]> = {
  HTML: [
    "HTML basics",
    "Elements",
    "Attributes",
    "Headings",
    "Paragraphs",
    "Links",
    "Images",
    "Lists",
    "Tables",
    "Forms",
    "Semantic HTML",
    "Accessibility",
    "Multimedia",
    "HTML5",
  ],
  CSS: [
    "CSS basics",
    "Selectors",
    "Colors",
    "Typography",
    "Box Model",
    "Display",
    "Position",
    "Flexbox",
    "Grid",
    "Responsive Design",
    "Media Queries",
    "Transitions",
    "Animations",
    "Variables",
    "Modern CSS",
  ],
  JAVASCRIPT: [
    "Variables",
    "Data types",
    "Operators",
    "Conditions",
    "Loops",
    "Functions",
    "Arrays",
    "Objects",
    "DOM",
    "Events",
    "Forms",
    "LocalStorage",
    "Fetch API",
    "Async/Await",
    "Promises",
    "ES6+",
    "Modules",
    "Error handling",
  ],
};

const STEPS = [
  {
    icon: BookOpen,
    title: "Learn",
    body: "Short lessons that explain one idea at a time, with a live editor on every page.",
  },
  {
    icon: Swords,
    title: "Practice",
    body: "Coding challenges with automated DOM tests and progressive hints. No answer until you ask.",
  },
  {
    icon: Rocket,
    title: "Build",
    body: "Real projects with requirements, a design reference and a checklist that tracks your progress.",
  },
  {
    icon: Trophy,
    title: "Track",
    body: "XP, levels, badges and streaks that make consistency visible and satisfying.",
  },
];

const FEATURES = [
  {
    icon: Code2,
    title: "A real editor, in your browser",
    body: "Monaco, the same engine behind VS Code, with syntax highlighting and a live preview that updates as you type.",
  },
  {
    icon: Zap,
    title: "Sandboxed by design",
    body: "Your code runs in an isolated frame with no access to the app, your session or your files. Experiment freely.",
  },
  {
    icon: Flame,
    title: "Streaks that stick",
    body: "A daily goal you set, a streak you maintain, and reminders that nudge rather than nag.",
  },
];

export default async function LandingPage() {
  const [user, courses] = await Promise.all([getCurrentUser(), getCourses()]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader user={user} />

      <main id="main" className="flex-1">
        {/* ------------------------------- Hero ------------------------------- */}
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center lg:px-6 lg:py-24">
            <div className="space-y-6">
              <Badge tone="primary" className="px-3 py-1">
                No setup required — runs in your browser
              </Badge>

              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Learn to Code.
                <br />
                <span className="text-primary">Build Real Things.</span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Master HTML, CSS and JavaScript through interactive lessons, coding
                challenges and real-world projects. Write real code from lesson one.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={user ? "/dashboard" : "/signup"}
                  className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  {user ? "Go to dashboard" : "Start Learning"}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/learn/html/html-introduction"
                  className="inline-flex h-12 items-center gap-2 rounded-lg border border-border bg-card px-6 text-[15px] font-semibold transition-colors hover:bg-muted"
                >
                  Explore Courses
                </Link>
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {["Free forever", "No credit card", "Your progress is saved"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <HeroPlayground />
              <p className="text-center text-xs text-muted-foreground">
                This is the real editor. Change the code and watch the preview respond.
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------- The loop ----------------------------- */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                One loop, repeated until it sticks
              </h2>
              <p className="mt-3 text-muted-foreground">
                Every part of CodeLearn exists to move you through this cycle.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <Card key={step.title} className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <step.icon className="size-5" />
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ Courses ------------------------------ */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Three courses, one path</h2>
              <p className="mt-3 text-muted-foreground">
                Start with HTML, add CSS to make it look right, then use JavaScript to
                make it respond. Each course is a complete unit on its own.
              </p>
            </div>

            <div className="mt-10 space-y-6">
              {courses.map((course) => {
                const topics = TOPICS[course.track] ?? [];
                return (
                  <Card key={course.id} interactive className="overflow-hidden">
                    <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <TrackIcon track={course.track} icon={course.icon} />
                          <div>
                            <h3 className="text-lg font-semibold">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {course.tagline}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {course.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {topics.slice(0, 8).map((topic) => (
                            <span
                              key={topic}
                              className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              {topic}
                            </span>
                          ))}
                          {topics.length > 8 && (
                            <span className="px-1 py-0.5 text-xs text-muted-foreground">
                              +{topics.length - 8} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 lg:items-end">
                        <div className="text-left lg:text-right">
                          <p className="text-2xl font-bold">
                            {course._count.lessons}
                            <span className="text-sm font-normal text-muted-foreground">
                              {" "}
                              lessons
                            </span>
                          </p>
                        </div>
                        <Link
                          href={`/learn/${course.slug}`}
                          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          View course
                          <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ----------------------------- Features ----------------------------- */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">
                  Built like a real developer tool
                </h2>
                <p className="text-muted-foreground">
                  Not a slideshow with a code sample at the bottom. You write the code,
                  you run it, you break it, and you read the error message.
                </p>
                <ul className="space-y-4 pt-2">
                  {FEATURES.map((feature) => (
                    <li key={feature.title} className="flex gap-3">
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <feature.icon className="size-4" />
                      </span>
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                          {feature.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <Card className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Your progress
                  </p>
                  <div className="mt-3 space-y-3">
                    {[
                      { label: "HTML", value: 90, tone: "bg-track-html" },
                      { label: "CSS", value: 60, tone: "bg-track-css" },
                      { label: "JavaScript", value: 20, tone: "bg-track-js" },
                    ].map((row) => (
                      <div key={row.label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{row.label}</span>
                          <span className="text-muted-foreground">{row.value}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${row.tone}`}
                            style={{ width: `${row.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="flex items-center gap-4 p-5">
                  <div className="flex gap-2">
                    {[
                      { icon: Flame, value: "12", label: "day streak" },
                      { icon: Trophy, value: "8", label: "badges" },
                      { icon: Zap, value: "4,250", label: "XP" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="flex-1 rounded-lg border border-border bg-muted/50 p-3 text-center"
                      >
                        <stat.icon className="mx-auto size-4 text-primary" />
                        <p className="mt-1 text-lg font-bold tabular-nums">{stat.value}</p>
                        <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------- CTA ------------------------------- */}
        <section>
          <div className="mx-auto max-w-3xl px-4 py-20 text-center lg:px-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Your first lesson takes ten minutes
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Create an account and you will be writing HTML in a real editor before you
              have finished your coffee.
            </p>
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-7 text-[15px] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              {user ? "Continue learning" : "Create free account"}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
