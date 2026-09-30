"use client";

import type { Task, TaskStatus } from "../lib/types";
import TaskItem from "./TaskItem";

const columns: {
  status: TaskStatus;
  title: string;
}[] = [
  {
    status: "todo",
    title: "Todo"
  },
  {
    status: "in-progress",
    title: "In Progress"
  },
  {
    status: "done",
    title: "Done"
  }
];

interface TaskBoardProps {
  tasks: Task[];
  loading: boolean;
  error: string;
  onRetry: () => void;
}

export default function TaskBoard({
  tasks,
  loading,
  error,
  onRetry
}: TaskBoardProps) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter(
          (task) => task.status === column.status
        );

        return (
          <section
            key={column.status}
            className="rounded-xl bg-gray-100 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                {column.title}
              </h2>

              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
                {columnTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {columnTasks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                  No tasks
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}