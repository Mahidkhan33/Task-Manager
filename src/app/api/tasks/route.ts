import { NextResponse } from "next/server";
import Task from "@/models/Task";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

/**
 * GET /api/tasks
 *
 * Returns all tasks that belong to the currently logged-in user.
 * Tasks are filtered by `userId` so users can only see their own data.
 */
export async function GET() {
  await connectDB();

  // Verify the request is coming from a logged-in user
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Fetch only tasks owned by this user
  const tasks = await Task.find({ userId: (user as any).userId });
  return NextResponse.json(tasks);
}

/**
 * POST /api/tasks
 *
 * Creates a new task for the currently logged-in user.
 *
 * The request body should contain: title, description, status, priority, dueDate.
 * `userId` is NOT taken from the request body — it's always pulled from the
 * verified JWT to prevent a user from creating tasks on behalf of another user.
 */
export async function POST(req: Request) {
  await connectDB();

  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Spread all submitted fields, then forcefully attach the authenticated user's ID
  const data = await req.json();

  const task = await Task.create({
    ...data,
    userId: (user as any).userId, // Always set server-side — never trust client input
  });

  return NextResponse.json(task);
}