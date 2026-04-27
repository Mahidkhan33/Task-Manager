# ⚡ TaskFlow — Modern Kanban Task Manager

TaskFlow is a premium, high-performance task management application built with **Next.js 15**, **React 19**, and **MongoDB**. It features a sleek Kanban-style board, secure user authentication, and a robust API for managing personal productivity.

![Dashboard Preview](https://via.placeholder.com/1200x600/000000/FFFFFF?text=TaskFlow+Dashboard+Preview)

---

## 🚀 Features

- **Secure Authentication**: Built-in signup and login system using JWT stored in `HttpOnly` cookies for maximum security.
- **Dynamic Kanban Board**: Organize tasks into `To Do`, `In Progress`, and `Done` columns with smooth transitions.
- **Full CRUD Support**: Create, read, update, and delete tasks with detailed metadata (priority, due dates, descriptions).
- **Personalized Experience**: Each user has a private workspace; tasks are filtered server-side by authenticated User IDs.
- **Modern UI/UX**: Crafted with Tailwind CSS 4, featuring a dark-mode aesthetic, glassmorphism effects, and responsive layouts.
- **Type Safety**: Fully written in TypeScript for a reliable developer experience.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15+](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend**: Next.js App Router (Route Handlers)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Auth**: JSON Web Tokens (JWT), Bcrypt.js, Cookies-next
- **Language**: TypeScript

---

## 📂 Project Structure

```text
src/
├── app/              # Next.js App Router (Pages & API Routes)
│   ├── api/          # Serverless API endpoints (Auth, Tasks)
│   ├── dashboard/    # Main Kanban application page
│   ├── login/        # Login page
│   └── signup/       # Signup page
├── components/       # Reusable UI components (Navbar, KanbanBoard, etc.)
├── lib/              # Shared logic (DB connection, JWT utils, Auth helpers)
├── models/           # Mongoose schemas (User, Task)
├── types/            # TypeScript interfaces and types
└── proxy.ts          # API Proxy configuration (if applicable)
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- MongoDB instance (local or Atlas)

### 2. Installation
```bash
git clone <repository-url>
cd task-manager
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
```

### 4. Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🛡️ API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate & set session cookie |
| `POST` | `/api/auth/logout` | Clear session cookie |
| `GET` | `/api/tasks` | Fetch all tasks for logged-in user |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/[id]` | Update an existing task |
| `DELETE` | `/api/tasks/[id]` | Remove a task |

---

## 📝 License
This project is for educational purposes. Feel free to use and modify it.
