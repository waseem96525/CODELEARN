import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "CodeLearn is free forever for learners. See what is included and what is coming next.",
};

const FREE_FEATURES = [
  "All 3 courses: HTML, CSS and JavaScript",
  "Every lesson with a live editor",
  "All coding challenges with automated tests",
  "All multi-file projects",
  "Free playground with templates and sharing",
  "Quick-reference cheat sheets",
  "XP, streaks, badges and certificates",
];

const FAQS = [
  {
    q: "Is CodeLearn really free?",
    a: "Yes. Every course, challenge, project and the playground are free, with no credit card and no trial period. An account is only needed so your progress, XP and streaks can be saved.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. The editor, preview and console all run in your browser. If you can open this page, you can write code.",
  },
  {
    q: "Will there be a paid plan?",
    a: "A Pro plan with advanced learning paths and priority features is on the roadmap. Everything that is free today will stay free.",
  },
  {
    q: "Can I use CodeLearn with my class or team?",
    a: "Yes — learners can already share playground links and certificates. Shared classrooms with assignments are planned as part of the Team plan.",
  },
];

export default async function PricingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Badge tone="success">Free forever · No credit card</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Learn to code for free</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Everything you need to go from your first tag to real projects costs nothing.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
          <Card className="flex flex-col p-6">
            <h2 className="font-semibold">Learner</h2>
            <p className="mt-1 text-4xl font-bold">
              $0
              <span className="text-base font-normal text-muted-foreground"> forever</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              The full CodeLearn experience, available right now.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full">
              <Link href={user ? "/dashboard" : "/signup"}>Start learning free</Link>
            </Button>
          </Card>

          <Card className={cn("relative flex flex-col border-primary p-6 shadow-pop")}>
            <Badge tone="primary" className="absolute -top-3 left-1/2 -translate-x-1/2">
              Coming soon
            </Badge>
            <h2 className="flex items-center gap-2 font-semibold">
              <Sparkles className="size-4 text-primary" aria-hidden />
              Pro
            </h2>
            <p className="mt-1 text-4xl font-bold">
              TBD
              <span className="text-base font-normal text-muted-foreground"> /month</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              For learners who want structure and proof of skill.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {[
                "Everything in Learner",
                "Advanced learning paths",
                "Verified certificates",
                "Interview-style practice sets",
                "Priority feature requests",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link href={user ? "/dashboard" : "/signup"}>Join free, upgrade later</Link>
            </Button>
          </Card>

          <Card className="flex flex-col p-6">
            <h2 className="font-semibold">Classroom</h2>
            <p className="mt-1 text-4xl font-bold">
              TBD
              <span className="text-base font-normal text-muted-foreground"> /seat</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              For teachers, bootcamps and teams.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {[
                "Everything in Pro",
                "Shared classrooms and assignments",
                "Student progress dashboard",
                "Custom learning paths",
                "Email support",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link href={user ? "/dashboard" : "/signup"}>Start with Learner</Link>
            </Button>
          </Card>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="mt-6 space-y-3">
            {FAQS.map((faq) => (
              <Card key={faq.q} className="p-5">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
