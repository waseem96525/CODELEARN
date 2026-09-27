export const SITE_NAME = "CodeLearn";

export const SITE_DESCRIPTION =
  "Master HTML, CSS and JavaScript through interactive lessons, live coding challenges and real-world projects. Learn in the browser, no setup required.";

export const SITE_TAGLINE = "Learn to Code. Build Real Things.";

const FALLBACK_SITE_URL = "http://localhost:3000";

/**
 * Normalises a candidate origin, or returns null if it is unusable.
 *
 * An empty string is the common failure here: a Vercel environment variable
 * that was added without a value is `""`, not `undefined`, and `new URL("")`
 * throws. That happens while collecting page data, so it fails the whole build
 * rather than one page.
 */
function cleanCandidate(value: string | undefined | null): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    // Deployment domains are provided without a scheme (e.g. "my-app.vercel.app").
    const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    // Keep any path prefix, but drop the trailing slash so joins stay tidy.
    const path = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${path}`;
  } catch {
    return null;
  }
}

/**
 * The public origin, used for canonical URLs and Open Graph tags.
 *
 * Resolution order: the configured value, then the two domains Vercel injects,
 * then localhost. It must never throw — this runs at module scope in the root
 * layout, so a bad value would take down every route in the build.
 */
export function siteUrl(): string {
  return (
    cleanCandidate(process.env.NEXT_PUBLIC_SITE_URL) ??
    cleanCandidate(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    cleanCandidate(process.env.VERCEL_URL) ??
    FALLBACK_SITE_URL
  );
}
