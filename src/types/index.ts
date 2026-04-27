/**
 * Shared TypeScript types used across both the frontend and API layer.
 * Keeping types in one place makes refactoring easier — update once, correct everywhere.
 */

/** Represents a user record as returned from the API (password is never included). */
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;  // ISO date string (e.g. "2026-04-22T12:00:00Z")
  updatedAt: string;
}

/** Represents a task document as returned from the API. */
export interface Task {
  _id: string;
  userId: string;         // ID of the user who owns this task
  title: string;
  description?: string;  // Optional — may be undefined if not provided
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;       // ISO date string when set, otherwise undefined
  createdAt: string;
  updatedAt: string;
}
