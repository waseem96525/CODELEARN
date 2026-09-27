export const SITE_NAME = "CodeLearn";

export const SITE_DESCRIPTION =
  "Master HTML, CSS and JavaScript through interactive lessons, live coding challenges and real-world projects. Learn in the browser, no setup required.";

export const SITE_TAGLINE = "Learn to Code. Build Real Things.";

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
