import { NextResponse } from "next/server";
import Task from "@/models/Task";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  await connectDB();

  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tasks = await Task.find({ userId: user.userId });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  await connectDB();

  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const task = await Task.create({
    ...data,
    userId: user.userId,
  });

  return NextResponse.json(task);
}