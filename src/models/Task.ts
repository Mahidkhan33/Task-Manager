import mongoose, { Schema, Document } from "mongoose";

/**
 * TypeScript interface for a Task document.
 * Each task is owned by a specific user (via `userId`).
 */
export interface ITask extends Document {
  userId: string;       // References the User who owns this task
  title: string;
  description?: string; // Optional — not every task needs extra detail
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: Date;       // Optional deadline
}

/**
 * Mongoose schema for the tasks collection.
 *
 * - `userId` uses `Schema.Types.ObjectId` and references the "User" model,
 *   which enables Mongoose population (joining) if needed in the future.
 * - `status` and `priority` use `enum` so only valid values can be stored.
 * - `{ timestamps: true }` adds automatic `createdAt` / `updatedAt` fields.
 */
const TaskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

/**
 * Export the Task model with the same hot-reload guard used in User.ts.
 * Checks `mongoose.models.Task` first to avoid re-compilation errors.
 */
export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);