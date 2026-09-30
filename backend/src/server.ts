import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/database.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL connected successfully");

    connection.release();

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MySQL connection failed:", error);
    process.exit(1);
  }
}

startServer();
