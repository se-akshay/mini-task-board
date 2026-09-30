"use client";

import { FormEvent, useState } from "react";
import type { Task, TaskStatus } from "../lib/types";
import { apiRequest } from "../lib/api";

interface CreateTaskResponse {
  success: boolean;
  data: Task;
}

interface AddTaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export default function AddTaskForm({
  onTaskCreated
}: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await apiRequest<CreateTaskResponse>(
        "/api/tasks",
        {
          method: "POST",
          body: JSON.stringify({
            title: trimmedTitle,
            status
          })
        }
      );

      onTaskCreated(response.data);

      setTitle("");
      setStatus("todo");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create task"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm sm:flex-row"
      >
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to be done?"
          disabled={loading}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500 disabled:bg-gray-100 disabled:text-gray-500"
        />

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as TaskStatus)
          }
          disabled={loading}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900  outline-none disabled:bg-gray-100"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}