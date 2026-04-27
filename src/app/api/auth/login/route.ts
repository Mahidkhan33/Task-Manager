import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/jwt";

/**
 * POST /api/auth/login
 *
 * Authenticates an existing user and issues a session cookie.
 *
 * Flow:
 *  1. Connect to the database.
 *  2. Validate that email and password were provided.
 *  3. Look up the user by email.
 *  4. Compare the submitted password against the stored bcrypt hash.
 *  5. Sign a JWT containing the user's ID.
 *  6. Set the JWT as an HttpOnly cookie so JavaScript can't read it (XSS protection).
 *  7. Return a success response — the browser stores the cookie automatically.
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Reject immediately if either field is missing
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // Try to find an account matching the submitted email
    const user = await User.findOne({ email });
    if (!user) {
      // Use a generic message to avoid revealing which accounts exist
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // bcrypt.compare hashes the incoming password and checks it against the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Sign a JWT with the user's MongoDB _id embedded as `userId`
    const token = signToken({ userId: user._id });
    const response = NextResponse.json({ message: "Login successful" });

    // Set the token as a secure, HttpOnly cookie:
    // - httpOnly: true  → JS cannot access it (prevents XSS token theft)
    // - secure: true    → only sent over HTTPS in production
    // - maxAge          → 7 days in seconds
    // - path: "/"       → available to all routes
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}