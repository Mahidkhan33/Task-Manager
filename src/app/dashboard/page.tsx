"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types";
import Navbar from "@/components/Navbar";
import KanbanBoard from "@/components/KanbanBoard";
import TaskModal from "@/components/TaskModal";

/**
 * Dashboard — the main screen users see after logging in.
 *
 * This Client Component:
 *  - Fetches the user's tasks from the API on mount.
 *  - Passes them to the KanbanBoard for display.
 *  - Controls the TaskModal for creating / editing tasks.
 */
export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // When `editingTask` is undefined the modal creates a new task.
  // When it holds a Task object the modal pre-fills fields for editing.
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches all tasks for the logged-in user from GET /api/tasks.
   * Called on first render and after every create / update / delete.
   */
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks once when the component first mounts (empty dependency array = run once)
  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * Handles both creating a new task (POST) and updating an existing one (PUT).
   * The URL and HTTP method are determined by whether `editingTask` is set.
   *
   * After the API call, the modal is closed and tasks are re-fetched to show
   * the latest data without a full page reload.
   */
  const handleCreateOrUpdate = async (formData: any) => {
    const url = editingTask ? `/api/tasks/${editingTask._id}` : "/api/tasks";
    const method = editingTask ? "PUT" : "POST";

    await fetch(url, {
      method,
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    setIsModalOpen(false);
    setEditingTask(undefined);
    fetchTasks(); // Refresh the board with the latest data
  };

  /**
   * Deletes a task after the user confirms the action.
   * Browser's `confirm()` is used as a lightweight guard against accidental deletes.
   */
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    }
  };

  /**
   * Updates only the `status` field of a task — triggered when the user
   * changes the status dropdown on a TaskCard.
   */
  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
    });
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Your Dashboard</h1>
            <p className="mt-2 text-white/50">Manage your work and stay productive.</p>
          </div>
          {/* Clicking "+ New Task" opens the modal in create mode (no editingTask) */}
          <button
            onClick={() => {
              setEditingTask(undefined);
              setIsModalOpen(true);
            }}
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-violet-700/40 ring-1 ring-white/10 transition hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-600/50 active:scale-95"
          >
            + New Task
          </button>
        </div>

        {/* Show a spinner while tasks are loading, then render the board */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent shadow-[0_0_12px_rgba(139,92,246,0.5)]"></div>
          </div>
        ) : (
          <KanbanBoard
            tasks={tasks}
            onEdit={(task) => {
              setEditingTask(task);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* TaskModal is always in the DOM but only visible when isOpen is true */}
      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  );
}
