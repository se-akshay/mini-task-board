"use client";

import { useEffect, useState } from "react";
import AddTaskForm from "../components/AddTaskForm";
import TaskBoard from "../components/TaskBoard";
import { apiRequest } from "../lib/api";
import type { Task, TaskStatus } from "../lib/types";

interface TasksResponse {
  success: boolean;
  data: Task[];
}

interface TaskResponse {
  success: boolean;
  data: Task;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  async function fetchTasks() {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest<TasksResponse>("/api/tasks");

      setTasks(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  function handleTaskCreated(task: Task) {
    setTasks((currentTasks) => [task, ...currentTasks]);
  }

  async function handleStatusChange(taskId: number, newStatus: TaskStatus) {
    const previousTask = tasks.find((task) => task.id === taskId);

    if (!previousTask) {
      return;
    }

    if (previousTask.status === newStatus) {
      return;
    }

    // Optimistically update the UI.
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );

    setUpdatingTaskId(taskId);

    try {
      const response = await apiRequest<TaskResponse>(`/api/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      // Replace optimistic task with the database response.
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? response.data : task)),
      );
    } catch (error) {
      // Roll back if the API request fails.
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? previousTask : task)),
      );

      setError(
        error instanceof Error ? error.message : "Failed to update task",
      );
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function handleDelete(taskId: number) {
    const previousTasks = tasks;

    // Optimistically remove the task.
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );

    setDeletingTaskId(taskId);

    try {
      await apiRequest<DeleteResponse>(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
    } catch (error) {
      // Restore the task if deletion fails.
      setTasks(previousTasks);

      setError(
        error instanceof Error ? error.message : "Failed to delete task",
      );
    } finally {
      setDeletingTaskId(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Mini Task Board
          </h1>

          <p className="mt-2 text-gray-600">
            Create, organize, and track your tasks.
          </p>
        </header>

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-sm font-medium text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        <AddTaskForm onTaskCreated={handleTaskCreated} />

        <div className="mt-8">
          <TaskBoard
            tasks={tasks}
            loading={loading}
            error={error}
            updatingTaskId={updatingTaskId}
            deletingTaskId={deletingTaskId}
            onRetry={fetchTasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </main>
  );
}
