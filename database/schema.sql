CREATE DATABASE IF NOT EXISTS mini_task_board;

USE mini_task_board;

CREATE TABLE IF NOT EXISTS tasks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    status ENUM('todo', 'in-progress', 'done')
        NOT NULL DEFAULT 'todo',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);