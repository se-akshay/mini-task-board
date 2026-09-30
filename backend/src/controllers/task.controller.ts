import type { Request, Response } from "express";
import pool from "../config/database.js";

const VALID_STATUSES = ["todo", "in-progress", "done"];

export async function getTasks(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query(
      `
      SELECT id, title, status, created_at
      FROM tasks
      ORDER BY created_at DESC
      `
    );

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks"
    });
  }
}

export async function createTask(req: Request, res: Response) {
  try {
    const { title, status = "todo" } = req.body;

    if (typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Title is required"
      });
      return;
    }

    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid task status"
      });
      return;
    }

    const [result] = await pool.execute(
      `
      INSERT INTO tasks (title, status)
      VALUES (?, ?)
      `,
      [title.trim(), status]
    );

    const insertId = (result as { insertId: number }).insertId;

    const [rows] = await pool.execute(
      `
      SELECT id, title, status, created_at
      FROM tasks
      WHERE id = ?
      `,
      [insertId]
    );

    res.status(201).json({
      success: true,
      data: (rows as unknown[])[0]
    });
  } catch (error) {
    console.error("Error creating task:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create task"
    });
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
      return;
    }

    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid task status"
      });
      return;
    }

    const [result] = await pool.execute(
      `
      UPDATE tasks
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    const affectedRows = (result as { affectedRows: number }).affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: "Task not found"
      });
      return;
    }

    const [rows] = await pool.execute(
      `
      SELECT id, title, status, created_at
      FROM tasks
      WHERE id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      data: (rows as unknown[])[0]
    });
  } catch (error) {
    console.error("Error updating task:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task"
    });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
      return;
    }

    const [result] = await pool.execute(
      `
      DELETE FROM tasks
      WHERE id = ?
      `,
      [id]
    );

    const affectedRows = (result as { affectedRows: number }).affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: "Task not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting task:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task"
    });
  }
}