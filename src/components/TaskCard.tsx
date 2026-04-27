"use client";

import { Task } from "@/types";

/** Props accepted by TaskCard */
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

/**
 * TaskCard — renders a single task as a card inside a Kanban column.
 *
 * Features:
 *  - Priority badge (colour-coded: blue / yellow / red)
 *  - Edit & Delete buttons that appear on hover
 *  - Due date display
 *  - Status dropdown to move the task between columns without opening the modal
 */
export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  // Map each priority level to its Tailwind colour classes
  const priorityColors: any = {
    low: "bg-blue-500/10 text-blue-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    high: "bg-red-500/10 text-red-500",
  };

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-indigo-500/50 hover:bg-white/10">
      
      {/* Top row: priority badge on the left, action buttons on the right */}
      <div className="flex items-start justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityColors[task.priority]}`}>
          {task.priority.toUpperCase()}
        </span>

        {/* Edit / Delete buttons — hidden by default, visible on card hover via Tailwind `group` */}
        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={() => onEdit(task)} className="text-white/50 hover:text-white">
            Edit
          </button>
          <button onClick={() => onDelete(task._id)} className="text-red-500/50 hover:text-red-500">
            Delete
          </button>
        </div>
      </div>

      {/* Task title and description */}
      <h3 className="mt-3 text-lg font-semibold text-white">{task.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-white/60">{task.description}</p>
      
      {/* Bottom row: due date + inline status selector */}
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
        {/* Format the ISO date string for human reading, or show a fallback */}
        <span className="text-xs text-white/40">
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
        </span>

        {/* Status dropdown — changing this calls onStatusChange which PUTs to the API */}
        <div className="relative">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="appearance-none rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-400 focus:outline-none hover:bg-white/10 transition cursor-pointer pr-8"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {/* Custom dropdown arrow icon (hidden from pointer events so the select still works) */}
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-violet-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
