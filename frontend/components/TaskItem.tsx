"use client";

import type { Task } from "../lib/types";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-gray-900">{task.title}</h3>

        <button
          type="button"
          className="text-sm text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>

      <div className="mt-4">
        <select
          value={task.status}
          onChange={() => {}}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
}
