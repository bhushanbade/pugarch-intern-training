# FacilityOps — Smart Facility Management Dashboard

## 1. Project overview

FacilityOps is a full-stack internal facility management app for tracking facilities, inspections, complaints, employees, and operational statistics. The React dashboard and one Angular inspection page use the same Node.js REST API and MySQL database.

## 2. Problem statement

Facility teams need one reliable place to find asset condition, inspection history, reported issues, and the people responsible. Separate spreadsheets make it difficult to keep those records related and current.

## 3. Objectives

- Store facility operations data in a relational MySQL database.
- Provide validated REST APIs for the web interfaces.
- Display dashboard statistics calculated from persisted records.
- Support basic search, filtering, sorting, and CRUD workflows.
- Demonstrate one API-backed Angular module alongside the main React app.

## 4. Features

- Dashboard totals and facility, inspection, and complaint status charts.
- Facility, inspection, complaint, and employee lists with search and filters.
- Facility details with related inspection and complaint history.
- Create, edit, and delete workflows with validation, API errors, and destructive-action confirmation.
- Complaint status (`Open`, `In Progress`, `Resolved`, `Closed`) and priority (`Low`, `Medium`, `High`, `Critical`).
- Facility performance comparison based on real inspections and complaints.
- One Angular Facility Inspection table with live API data and status filtering.
- Responsive operations shell with consistent navigation, a global API-backed record search (`Ctrl+K`), and open-complaint notifications.

## 5. Technology stack

- **React + Vite + TypeScript** build the primary user interface.
- **React Router** handles client-side navigation.
- **Axios** sends API requests.
- **Recharts** displays data-backed status charts.
- **Node.js + Express.js** provide the REST API.
- **mysql2** connects the API to **MySQL**.
- **Angular + TypeScript + HttpClient** provide one additional API-connected inspection page.

## 6. System architecture

```text
React + Axios ──┐
                ├── HTTP REST API (Node.js + Express) ── mysql2 ── MySQL
Angular + HttpClient ─┘
```

The React or Angular page asks the Express API for data. The API validates requests and runs parameterized MySQL queries. MySQL stores the shared records. The API returns JSON for either user interface.

## 7. Database design

The [MySQL schema](./database/schema.sql), [sample data](./database/seed.sql), and [ERD](./database/ERD.md) define six related tables: users, departments, employees, facilities, inspections, and complaints. Foreign keys preserve relationships; unique employee emails and indexes support common lists. Complaint resolution notes and dates are stored with the complaint.

## 8. API endpoints

All endpoints are prefixed with `/api`. Responses use `{ "data": ... }`; list endpoints include `{ "data": [...], "total": n }`. Validation errors return 422, invalid filter/query values return 400, missing records return 404, and database constraint conflicts return 409.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/dashboard/stats` | Database totals, status counts, and recent records |
| GET | `/departments` | Department form options |
| GET | `/inspectors` | Employee options for inspection assignment |
| GET/POST | `/facilities` | Search/filter/sort facilities; create |
| GET/PUT/PATCH/DELETE | `/facilities/:id` | Read details and related records; edit; partial edit; delete |
| GET/POST | `/inspections` | Search/filter/sort inspections; create |
| GET/PUT/PATCH/DELETE | `/inspections/:id` | Read; edit; partial edit; delete |
| GET/POST | `/complaints` | Search/filter/sort complaints; create |
| GET/PUT/PATCH/DELETE | `/complaints/:id` | Read; edit; partial status/resolution edit; delete |
| GET/POST | `/employees` | Search employees; create |
| GET/PUT/PATCH/DELETE | `/employees/:id` | Read; edit; partial edit; delete |

List requests support `search`, resource-specific filters, `sort`, and `direction`. Sorting is restricted to known columns.

## 9. Frontend structure

```text
frontend/src/
  components/ reusable forms, tables, filters, charts
  hooks/      API-backed resource state
  layouts/    responsive application shell, navigation, and global search
  pages/      dashboard and data-module routes
  services/   Axios API client
  types/      shared TypeScript records
  App.tsx     React Router page map
```

## 10. Angular module

`angular-module/` contains one standalone **Facility Inspection** page. Its Angular service uses `HttpClient` to read `/api/inspections`; it presents facility, date, inspector, status, loading/error states, and a status filter. It calls the same Express server and database as React.

## 11. Interface and accessibility

The React and Angular pages share a restrained navy, neutral, and indigo visual system with responsive navigation, keyboard-visible focus states, semantic tables, and status badges. All application pages include a readable footer crediting FacilityOps and project developer Bhushan Kailas Bade (PugArch intern). The React header search queries the existing facility, inspection, complaint, and employee APIs; `Ctrl+K` focuses the search field. Complaint notifications load current open complaints from the API. No dashboard or search results are backed by mock data.

## 12. Installation

Requirements: Node.js 20+, npm, MySQL 8+.

```sh
cd day-10/final-project/backend
npm install
```

Install frontend and Angular dependencies in their respective directories with `npm install`.

## 13. MySQL setup

Run `database/schema.sql`, followed by `database/seed.sql`, in a local MySQL client:

```sh
mysql -u root -p < database/schema.sql
mysql -u root -p facility_ops < database/seed.sql
```

The schema creates the `facility_ops` database. Seed records are for local evaluation; change all sample account details before production use.

## 14. Backend setup

```powershell
cd day-10/final-project/backend
Copy-Item .env.example .env
# Set DB_USER and DB_PASSWORD in .env
npm install
npm run dev
```

The API listens on port 5000 by default. `/api/health` checks server/database connectivity.

## 15. React setup

```sh
cd day-10/final-project/frontend
npm install
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`). Vite proxies `/api` to Express on port 5000 during local development.

## 16. Angular setup

```sh
cd day-10/final-project/angular-module
npm install
npm start
```

Open the Angular development URL (normally `http://localhost:4200`). The local proxy forwards `/api` to the same Express API.

## 17. Environment variables

Copy `backend/.env.example` to `backend/.env` and configure:

```dotenv
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=facility_ops
DB_USER=root
DB_PASSWORD=your_password
```

Never commit `.env` or put database credentials in browser code.

## 18. Running the project

Start MySQL and load the schema and seed files, then start the Express API, React frontend, and optionally the Angular module in separate terminals. Both frontends call the same `/api` routes through their development proxies.

## 19. Testing

```sh
cd backend
npm test
npm run check
```

```sh
cd frontend
npm run typecheck
npm run build
```

```sh
cd angular-module
npm run build
```

Backend tests include database-independent API validation/error cases. With a configured MySQL test database, the CRUD test suite checks persistence and relationships. Manual CRUD checks require the local MySQL service and the SQL setup above.


## 20. Future scope

Authentication and roles, scheduled inspection reminders, file attachments, audit history, and deployment configuration can be considered after the core local application is verified.
