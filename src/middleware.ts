import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

/**
 * middleware.ts — Route protection logic.
 *
 * This function is called for every incoming request and decides whether
 * to allow it, redirect to /login (unauthenticated), or redirect to /dashboard
 * (already authenticated user trying to visit login/signup).
 */
export function middleware(req: NextRequest) {
  // Read the auth token from the browser's cookie jar
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Public routes that anyone can visit without being logged in
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  /**
   * Internal & Static Paths
   * - _next: Next.js system files (JS, CSS)
   * - api: Backend endpoints
   * - favicon, images, etc: Static assets in /public
   */
  const isStaticOrInternal =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes("favicon.ico") ||
    /\.(.*)$/.test(pathname); // Matches any path with a file extension (e.g. .png)

  // Allow static assets and system paths to pass through without auth checks
  if (isStaticOrInternal) {
    return NextResponse.next();
  }

  // No token + trying to visit a protected page → send to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Already logged in + visiting login or signup → redirect to dashboard
  if (token && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // All other cases — allow the request through normally
  return NextResponse.next();
}