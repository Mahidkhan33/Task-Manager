import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/auth/logout
 *
 * Logs the user out by clearing the `token` cookie.
 *
 * We use the `cookies()` helper to delete the token. This ensures
 * the browser discards the session identifier, effectively logging
 * the user out.
 */
export async function POST() {
  const cookieStore = await cookies();
  
  // Explicitly delete the cookie with the same path it was set on
  cookieStore.delete("token");

  return NextResponse.json({ message: "Logged out successfully" });
}
