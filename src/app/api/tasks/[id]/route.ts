import { NextResponse } from "next/server";
import Task from "@/models/Task";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

/**
 * GET /api/tasks/[id]
 *
 * Fetches a single task by its MongoDB `_id`.
 * The query always includes `userId` so a user can only read their own tasks.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // `params` is a Promise in the Next.js App Router — we must await it
  const { id } = await params;

  // Scoped query: matches both the task _id AND the owner's userId
  const task = await Task.findOne({ _id: id, userId: (user as any).userId });

  if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

  return NextResponse.json(task);
}

/**
 * PUT /api/tasks/[id]
 *
 * Updates an existing task with the data provided in the request body.
 *
 * Uses `findOneAndUpdate` with both `_id` and `userId` so users can only
 * modify tasks they own. `{ new: true }` returns the updated document.
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();

  const task = await Task.findOneAndUpdate(
    { _id: id, userId: (user as any).userId }, // Filter: must own the task
    { ...data },                                // Update: apply all sent fields
    { new: true }                               // Option: return the updated doc
  );

  if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

  return NextResponse.json(task);
}

/**
 * DELETE /api/tasks/[id]
 *
 * Permanently deletes a task by ID.
 * The ownership check (`userId`) ensures users can't delete each other's tasks.
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Deletes the task only if it belongs to the authenticated user
  const task = await Task.findOneAndDelete({ _id: id, userId: (user as any).userId });

  if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

  return NextResponse.json({ message: "Task deleted successfully" });
}
