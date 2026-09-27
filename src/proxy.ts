import { NextResponse, type NextRequest } from "next/server";

/**
 * Cheap first-line redirect so signed-out users never see a flash of protected
 * UI, and authenticated users skip the login pages.
 *
 * This is deliberately a *shape* check, not an authorisation decision. The
 * authoritative checks are `requireUser` / `requireAdmin` in
 * `src/lib/auth/session.ts`, which run on the server for every protected page
 * and every mutation. Bypassing or skipping this file grants nothing.
 *
 * `/certificate/*` is intentionally public: a certificate's whole purpose is
 * that it can be opened by someone who is not signed in, and the page exposes
 * nothing beyond the holder's name, the path title and the serial.
 *
 * Kept free of shared modules/globals so it stays safe if this ever runs at a
 * CDN edge (see the Next.js proxy docs).
 */

const SESSION_COOKIE = "codelearn_session";
const SESSION_SECRET = process.env.SESSION_SECRET;

/** Routes reachable only when signed out; signed-in users get bounced to app. */
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

/** Prefixes requiring an authenticated session. */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/learn",
  "/practice",
  "/projects",
  "/playground",
  "/bookmarks",
  "/notes",
  "/achievements",
  "/profile",
  "/settings",
  "/onboarding",
  "/admin",
  "/roadmap",
];

function hasSessionCookie(req: NextRequest): boolean {
  const value = req.cookies.get(SESSION_COOKIE)?.value;
  if (!value) return false;
  // Shape check only: "<token>.<mac>". Real verification is server-side.
  const idx = value.lastIndexOf(".");
  return idx > 0 && idx < value.length - 1;
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hasSession = hasSessionCookie(req);

  if (!SESSION_SECRET && process.env.NODE_ENV === "production") {
    return new NextResponse("SESSION_SECRET is not configured", { status: 500 });
  }

  const isAuthRoute = AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (isProtected && !hasSession) {
    const url = new URL("/login", req.url);
    if (pathname !== "/") url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Everything except static assets, image optimisation and the API routes
     * that intentionally stay public.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
