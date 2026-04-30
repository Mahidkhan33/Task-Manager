import { NextResponse } from "next/server";
import Task from "@/models/Task";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const task = await Task.findOne({ _id: id, userId: (user as any).userId });

  if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

  return NextResponse.json(task);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();

  const task = await Task.findOneAndUpdate(
    { _id: id, userId: (user as any).userId },
    { ...data },
    { new: true }
  );

  if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

  return NextResponse.json(task);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const task = await Task.findOneAndDelete({ _id: id, userId: (user as any).userId });

  if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

  return NextResponse.json({ message: "Task deleted successfully" });
}
