"use client";

import { Task } from "@/types";
import TaskCard from "./TaskCard";

/** Props accepted by KanbanBoard */
interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

/**
 * KanbanBoard — displays tasks grouped into three columns: Todo, In Progress, Done.
 *
 * It does NOT manage any state itself — it's a "dumb" presentational component
 * that receives all data and callbacks from the Dashboard parent.
 */
export default function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange }: KanbanBoardProps) {
  // The three fixed columns that make up a Kanban board
  const columns = [
    { id: "todo", title: "Todo" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col gap-4">

          {/* Column header: coloured dot + title + task count badge */}
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-3">
              {/* Colour-coded dot indicates which column we're in */}
              <div className={`h-2 w-2 rounded-full ${
                column.id === "todo" ? "bg-violet-500" : 
                column.id === "in-progress" ? "bg-amber-500" : "bg-emerald-500"
              }`}></div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
                {column.title}
              </h2>
            </div>
            {/* Count of tasks currently in this column */}
            <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-white/5 px-1.5 text-[10px] font-bold text-white/20">
              {tasks.filter((t) => t.status === column.id).length}
            </span>
          </div>

          {/* Task cards: filter the full task list to only show cards for this column */}
          <div className="flex flex-col gap-4">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))}
          </div>

        </div>
      ))}
    </div>
  );
}
