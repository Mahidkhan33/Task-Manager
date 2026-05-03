"use client";

import { useState, useEffect } from "react";
import { Task, TaskFormData } from "@/types";
import Navbar from "@/components/Navbar";
import KanbanBoard from "@/components/KanbanBoard";
import TaskModal from "@/components/TaskModal";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateOrUpdate = async (formData: TaskFormData) => {
    const url = editingTask ? `/api/tasks/${editingTask._id}` : "/api/tasks";
    const method = editingTask ? "PUT" : "POST";

    await fetch(url, {
      method,
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    setIsModalOpen(false);
    setEditingTask(undefined);
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    }
  };

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
