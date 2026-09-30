"use client";

import { useEffect, useState } from "react";
import AddTaskForm from "../components/AddTaskForm";
import TaskBoard from "../components/TaskBoard";
import { apiRequest } from "../lib/api";
import type { Task } from "../lib/types";

interface TasksResponse {
  success: boolean;
  data: Task[];
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchTasks() {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest<TasksResponse>(
        "/api/tasks"
      );

      setTasks(response.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load tasks"
      );
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

        <AddTaskForm onTaskCreated={handleTaskCreated} />

        <div className="mt-8">
          <TaskBoard
            tasks={tasks}
            loading={loading}
            error={error}
            onRetry={fetchTasks}
          />
        </div>
      </div>
    </main>
  );
}