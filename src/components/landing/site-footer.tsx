import Link from "next/link";
import { Code2 } from "lucide-react";

const COLUMNS = [
  {
    title: "Learn",
    links: [
      { href: "/learn/html", label: "HTML Fundamentals" },
      { href: "/learn/css", label: "CSS Fundamentals" },
      { href: "/learn/javascript", label: "JavaScript Fundamentals" },
      { href: "/roadmap", label: "Learning roadmap" },
    ],
  },
  {
    title: "Practice",
    links: [
      { href: "/practice", label: "Coding challenges" },
      { href: "/projects", label: "Mini projects" },
      { href: "/playground", label: "Free playground" },
      { href: "/reference", label: "Quick reference" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/achievements", label: "Achievements" },
      { href: "/profile", label: "Profile" },
      { href: "/settings", label: "Settings" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Code2 className="size-4" />
              </span>
              CodeLearn
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Learn HTML, CSS and JavaScript by writing real code. Free, browser-based,
              and open to everyone.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} CodeLearn. Built for people learning to code.</p>
          <p>Learn &rarr; Write code &rarr; See results &rarr; Repeat</p>
        </div>
      </div>
    </footer>
  );
}
