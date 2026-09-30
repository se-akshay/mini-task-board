"use client";

import type { Task, TaskStatus} from "../lib/types";

interface TaskItemProps {
  task: Task;
  updating: boolean;
  deleting: boolean;
  onStatusChange: (
    taskId: number,
    status: TaskStatus
  ) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskItem({ task,
  updating,
  deleting,
  onStatusChange,
  onDelete }: TaskItemProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-gray-900">{task.title}</h3>

        <button
          type="button"
          disabled={deleting || updating}
          onClick={() => onDelete(task.id)}
          className="text-sm text-red-500 hover:text-red-700"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      <div className="mt-4">
        <select
          value={task.status}
           disabled={updating || deleting}
          onChange={(event) =>
            onStatusChange(
              task.id,
              event.target.value as TaskStatus
            )
          }
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 "
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        {updating && (
          <p className="mt-2 text-xs text-gray-500">
            Updating...
          </p>
        )}
      </div>
    </div>
  );
}
