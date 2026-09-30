# Mini Task Board

Mini Task Board is a full-stack task management application that allows users to create, view, update, and delete tasks.

Tasks can be organized into three statuses:

- Todo
- In Progress
- Done

The application has a Next.js frontend, a separate Express.js backend, and a MySQL database for persistent storage.

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- MySQL

## Features

- Create new tasks
- View all tasks
- Update task status
- Delete tasks
- Persistent data storage using MySQL
- REST API architecture
- Loading states
- Error handling
- Retry support when API requests fail
- Optimistic UI updates for status changes and deletion
- Responsive user interface

## How It Works

The application follows a simple client-server architecture.

The Next.js frontend communicates with the Express.js backend through REST APIs. The backend handles task operations and communicates with MySQL to store and retrieve task data.

```text
Next.js Frontend
       |
       | REST API
       v
Express.js Backend
       |
       | SQL Queries
       v
MySQL Database
```

## Environment Variables

Create `.env` files for both backend and frontend.

Backend `backend/.env`:

```env
PORT=4000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mini_task_board

FRONTEND_URL=http://localhost:3000
```

Frontned `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Installation & Running (Local)

### Bakcend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

## Database Setup

Make sure MySQL is installed and running.

Open MySQL:

```bash
mysql -u root -p
```

Create the database and tables by running the schema file:

```sql
source C:/path/to/mini-task-board/database/schema.sql;
```

After creating the database, seed the initial sample tasks using:

```sql
source C:/path/to/mini-task-board/database/seed.sql;
```
