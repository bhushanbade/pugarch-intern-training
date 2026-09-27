# DAY 7 — Next.js + Node.js Employee Management System

## Objective

Build a modern Employee Management System using Next.js for the frontend and Node.js + Express for the backend.

The project demonstrates modern React application development, REST API development, CRUD operations, dynamic routes, responsive UI design, and a logical backend project structure.

---

## Technologies Used

### Frontend

- Next.js
- React
- TypeScript
- CSS Modules
- Lucide React
- Next.js App Router

### Backend

- Node.js
- Express.js
- JavaScript
- CORS
- JSON file storage

### Development Tools

- Visual Studio Code
- npm
- Git
- GitHub
- Postman

---

# Project Structure

```text
day-07/
│
├── next-app/
│   │
│   ├── app/
│   │   ├── components/
│   │   │   ├── EmployeeDrawer.module.css
│   │   │   ├── EmployeeDrawer.tsx
│   │   │   ├── EmployeeTable.module.css
│   │   │   ├── EmployeeTable.tsx
│   │   │   ├── EmployeeToolbar.module.css
│   │   │   ├── EmployeeToolbar.tsx
│   │   │   ├── Sidebar.module.css
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatsCard.module.css
│   │   │   └── StatsCard.tsx
│   │   │
│   │   ├── employees/
│   │   │   ├── [id]/
│   │   │   │   ├── employee-details.module.css
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── employee-layout.module.css
│   │   │   ├── employees.css
│   │   │   └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── eslint.config.mjs
│   └── README.md
│
├── node-api/
│   │
│   ├── controllers/
│   │   └── employeeController.js
│   │
│   ├── data/
│   │   └── employees.json
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │   └── employeeRoutes.js
│   │
│   ├── services/
│   │   └── employeeService.js
│   │
│   ├── utils/
│   │
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
└── README.md