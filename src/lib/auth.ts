import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

/**
 * Reads the `token` cookie from the incoming request and verifies it.
 *
 * Returns the decoded JWT payload (which contains the user's `userId`)
 * if the token is valid, or `null` if the cookie is missing / the token
 * is expired or tampered with.
 *
 * This is used in every protected API route to identify the logged-in user.
 */
export const getUserFromToken = async () => {
  // `cookies()` is a Next.js server helper that reads the request's cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // No cookie present — user is not logged in
  if (!token) return null;

  try {
    // verifyToken will throw if the token is invalid or expired
    return verifyToken(token);
  } catch {
    // Token verification failed — treat as unauthenticated
    return null;
  }
};