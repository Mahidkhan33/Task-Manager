
"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Task } from "@/types";
import TaskCard from "./TaskCard";

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const columns = [
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

function Column({
  id,
  title,
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}: any) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col gap-4 min-h-[500px]"
    >
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full ${
            id === "todo" ? "bg-violet-500" :
            id === "in-progress" ? "bg-amber-500" : "bg-emerald-500"
          }`}></div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
            {title}
          </h2>
        </div>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-white/5 px-1.5 text-[10px] font-bold text-white/20">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((task: any) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {tasks.map((task: any) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanBoard({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t._id === String(event.active.id));
    if (task) setActiveTask(task);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);
    const overId = String(over.id);

    let newStatus = overId;

    if (!["todo", "in-progress", "done"].includes(newStatus)) {
      const overTask = tasks.find((t) => t._id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (["todo", "in-progress", "done"].includes(newStatus)) {
      const activeItem = tasks.find((t) => t._id === taskId);
      if (activeItem && activeItem.status !== newStatus) {
        onStatusChange(taskId, newStatus);
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column) => {
          const priorityWeight: any = { high: 3, medium: 2, low: 1 };
          const columnTasks = tasks
            .filter((t) => t.status === column.id)
            .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

          return (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={columnTasks}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          );
        })}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90 shadow-2xl shadow-violet-500/20">
            <TaskCard
              task={activeTask}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
