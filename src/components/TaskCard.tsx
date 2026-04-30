"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task._id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const priorityColors: any = {
    low: "bg-blue-500/10 text-blue-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    high: "bg-red-500/10 text-red-500",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative rounded-2xl border border-white/10 bg-white/5 p-4 cursor-grab transition-all hover:border-indigo-500/50 hover:bg-white/10"
    >
      <div className="flex items-start justify-between">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority.toUpperCase()}
        </span>

        <div
          className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(task)}
            className="text-white/50 hover:text-white"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className="text-red-500/50 hover:text-red-500"
          >
            Delete
          </button>
        </div>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-white">{task.title}</h3>

      <p className="mt-1 line-clamp-2 text-sm text-white/60">
        {task.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-xs text-white/40">
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No deadline"}
        </span>

        <div className="relative" onPointerDown={(e) => e.stopPropagation()}>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="appearance-none rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-400 focus:outline-none hover:bg-white/10 transition cursor-pointer pr-8"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-violet-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}