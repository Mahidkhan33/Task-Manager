import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

/**
 * POST /api/auth/signup
 *
 * Creates a new user account.
 *
 * Flow:
 *  1. Connect to the database.
 *  2. Validate that name, email, and password were sent in the request body.
 *  3. Check if an account with that email already exists.
 *  4. Hash the password with bcrypt (salt rounds = 10) before storing.
 *  5. Save the new user and return a 201 Created response.
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    // Parse the JSON body sent from the signup form
    const { name, email, password } = await req.json();

    // All three fields are required — reject early if any are missing
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Prevent duplicate accounts — email must be unique
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // bcrypt.hash(password, 10): 10 salt rounds is the industry-standard balance
    // between security and performance
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}