"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types";
import DatePicker from "@/components/DatePicker";

/** Props accepted by TaskModal */
interface TaskModalProps {
  task?: Task;       // If provided, the modal opens in "edit" mode pre-filled with this task
  isOpen: boolean;   // Controls modal visibility
  onClose: () => void;
  onSubmit: (data: any) => void;
}

/**
 * TaskModal — a full-screen overlay form for creating or editing a task.
 *
 * It operates in two modes:
 *  - Create mode: `task` prop is undefined → blank form, "Create Task" button
 *  - Edit mode:   `task` prop is a Task object → form pre-filled, "Save Changes" button
 *
 * The modal is NOT rendered at all when `isOpen` is false (early return below).
 */
export default function TaskModal({ task, isOpen, onClose, onSubmit }: TaskModalProps) {
  // Local form state — mirrors the fields of a Task document
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
  });

  /**
   * Sync the form when the modal opens or the task prop changes.
   *
   * - If `task` is provided (edit mode): populate the form with existing values.
   * - If `task` is undefined (create mode): reset everything to defaults.
   *
   * `dueDate` is converted from an ISO datetime string to a plain YYYY-MM-DD date
   * string so the DatePicker input can read it correctly.
   */
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || "todo",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        dueDate: "",
      });
    }
  }, [task, isOpen]); // Re-run whenever the task or open state changes

  // Don't mount the modal DOM at all when it's closed
  if (!isOpen) return null;

  return (
    // Backdrop: semi-transparent black overlay with blur
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-zinc-950 p-10 shadow-2xl shadow-indigo-500/10">
        
        {/* Dynamic title: "Edit Task" vs "Create Task" */}
        <h2 className="text-3xl font-bold tracking-tight text-white mb-8">
          {task ? "Edit Task" : "Create Task"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData); // Pass form data up to the Dashboard handler
          }}
          className="space-y-6"
        >
          {/* Title field — required */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-white/40 ml-1">Title</label>
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/20 focus:border-violet-500/50 focus:bg-white/10 focus:outline-none transition-all"
              placeholder="What needs to be done?"
            />
          </div>
          
          {/* Description field — optional, multi-line */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-white/40 ml-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/20 focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none transition-all resize-none"
              rows={4}
              placeholder="Add some details..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Priority selector — three toggle buttons instead of a dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-white/40 ml-1">Priority</label>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map((p) => {
                  const active = formData.priority === p;

                  // Each priority level has a unique active colour; inactive buttons are muted
                  const colours = {
                    low: active ? "bg-blue-500/20 border-blue-500/60 text-blue-400" : "border-white/5 bg-white/5 text-white/30 hover:text-white/60",
                    medium: active ? "bg-amber-500/20 border-amber-500/60 text-amber-400" : "border-white/5 bg-white/5 text-white/30 hover:text-white/60",
                    high: active ? "bg-red-500/20 border-red-500/60 text-red-400" : "border-white/5 bg-white/5 text-white/30 hover:text-white/60",
                  };
                  return (
                    <button
                      key={p}
                      type="button" // Prevent accidental form submission
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`flex-1 rounded-xl border py-3 text-xs font-bold uppercase tracking-wider transition-all ${colours[p]}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due date — rendered by the custom DatePicker component */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-white/40 ml-1">Due Date</label>
              <DatePicker
                value={formData.dueDate}
                onChange={(val) => setFormData({ ...formData, dueDate: val })}
              />
            </div>
          </div>
          
          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-4 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-white/30 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-700/40 ring-1 ring-white/10 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-600/50 active:scale-95"
            >
              {task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
