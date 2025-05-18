# Noted API

Noted API is a personal project aimed at building a flexible and efficient task management system tailored specifically to my workflow and organizational needs. The goal is to create a robust backend service that supports managing multiple projects, each containing hierarchical tasks that can be categorized as lists or individual items.

This API is built with Express and TypeScript for scalability and maintainability, while Prisma ORM provides a type-safe and intuitive interface to interact with a PostgreSQL database. Noted API serves as a solid foundation for experimenting with modern backend technologies and best practices, while offering a feature-rich task and project management experience.

---

## Features

- User authentication (username/password)
- Project management: create and manage projects
- Task management: hierarchical tasks with lists and items
- Task statuses and types (TODO, ONGOING, COMPLETED, etc.)
- PostgreSQL database with Prisma ORM for type-safe queries
- TypeScript for robust and maintainable code

---

## Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL database
- npm or yarn

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/noted-api.git
cd noted-api
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Setup environment variables

Create a .env file in the root directory with your database connection string:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/noted"
```

Replace USER and PASSWORD accordingly.

### 4. Generate Prisma Client and run migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```
