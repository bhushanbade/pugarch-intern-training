# Day 8 — Facilities Management API and SQL

## Project Overview

A small Laravel JSON API backed by MySQL for managing departments, employees, facilities, inspections, and complaints. The SQL folder contains the matching MySQL schema and query examples; the API focuses on CRUD for facilities, inspections, and complaints.

## Problem Statement

Facility data is more useful when it is stored consistently and linked to the people and departments responsible for it. This exercise models those links, supports routine record management, and demonstrates how SQL queries can answer operational questions such as which facilities need attention.

## Features

- Relational schema with primary keys, foreign keys, unique constraints, and query indexes.
- Eloquent models and relationships for all six entities.
- MySQL migrations and realistic, repeatable sample data.
- Paginated JSON CRUD APIs with request validation and explicit JSON error rendering.
- Facility deletion protection while inspection or complaint history exists.
- SQL examples for filtering, sorting, aggregation, joins, subqueries, indexes, and transactions.
- API rate limiting at 60 requests per minute per client IP.

## Technology Stack

- PHP 8.3 or newer
- Laravel 13.x (`laravel/framework` `^13.0`)
- MySQL 8.x
- Composer 2
- PHPUnit (feature tests)

No frontend or third-party API/authentication packages are included.

## Architecture

```text
HTTP request
  → routes/api.php
  → controller
  → Form Request validation
  → Eloquent model / relationship
  → MySQL
  → JSON Resource or JSON error response
```

Laravel API routes are prefixed with `/api`. Controllers keep the operations small; Form Requests validate input, models describe persistence and relationships, and API Resources define response fields. Laravel renders exceptions from API routes as JSON, including validation errors (422) and missing records (404).

## Database Design

| Table | Purpose | Important columns |
|---|---|---|
| `users` | Inspector / complaint submitter accounts | `id`, `name`, unique `email`, hashed `password`, `role` |
| `departments` | Organisational units | `id`, unique `name` |
| `employees` | Staff directory | `id`, `department_id`, unique `email`, `salary`, `hired_on` |
| `facilities` | Sites and their current condition | `id`, `department_id`, `condition_score` (1–5), `is_operational` |
| `inspections` | Dated condition checks | `id`, `facility_id`, nullable `inspector_id`, `rating`, `inspected_at` |
| `complaints` | Reported facility issues | `id`, `facility_id`, nullable `submitted_by`, `priority`, `status` |

Every table has an auto-incrementing primary key and timestamps. Foreign keys protect referential integrity; account references become null when a user is deleted, while departments and facilities with dependent records cannot be deleted accidentally. Indexes support employee salary lookups, poor-condition facility searches, inspection history, and complaint counts. The migrations in `laravel-api/database/migrations/` are the executable source of truth; `sql/schema.sql` is their MySQL reference.

## Relationships

See [database/ERD.md](./database/ERD.md) for the relationship diagram and delete rules.

- A department has many employees and facilities.
- An employee belongs to one department.
- A facility belongs to one department and has many inspections and complaints.
- An inspection belongs to one facility and optionally to one inspecting user.
- A complaint belongs to one facility and optionally to its submitting user.
- A user can be assigned to many inspections and submit many complaints.

## API Documentation

All endpoints accept and return JSON. Send `Accept: application/json`; send `Content-Type: application/json` with request bodies. List endpoints return Laravel’s paginated resource shape (`data`, `links`, and `meta`). Validation failures return HTTP 422 with a message and field-level `errors`; missing IDs return 404. API routes are limited to 60 requests per minute per IP.

A successful create or single-record read/update returns the resource under `data`, for example:

```json
{
  "data": {
    "id": 6,
    "department_id": 1,
    "name": "North Library",
    "condition_score": 4,
    "department": { "id": 1, "name": "Operations" }
  }
}
```

Errors use Laravel's JSON format. Invalid input returns 422 with field-level messages; an unknown ID returns 404. Deleting a facility that still has history returns 409:

```json
{
  "message": "The given data was invalid.",
  "errors": { "department_id": ["The selected department id is invalid."] }
}
```

```json
{ "message": "A facility with inspection or complaint history cannot be deleted." }
```

| Method | Endpoint | Purpose | Success |
|---|---|---|---|
| GET | `/api/facilities` | List facilities (includes department) | 200 |
| POST | `/api/facilities` | Create a facility | 201 |
| GET | `/api/facilities/{facility}` | Show a facility | 200 |
| PUT / PATCH | `/api/facilities/{facility}` | Replace / partially update a facility | 200 |
| DELETE | `/api/facilities/{facility}` | Delete a facility with no history | 200 |
| GET | `/api/inspections` | List inspections (includes facility and inspector) | 200 |
| POST | `/api/inspections` | Create an inspection | 201 |
| GET | `/api/inspections/{inspection}` | Show an inspection | 200 |
| PUT / PATCH | `/api/inspections/{inspection}` | Replace / partially update an inspection | 200 |
| DELETE | `/api/inspections/{inspection}` | Delete an inspection | 200 |
| GET | `/api/complaints` | List complaints (includes facility and submitter) | 200 |
| POST | `/api/complaints` | Create a complaint | 201 |
| GET | `/api/complaints/{complaint}` | Show a complaint | 200 |
| PUT / PATCH | `/api/complaints/{complaint}` | Replace / partially update a complaint | 200 |
| DELETE | `/api/complaints/{complaint}` | Delete a complaint | 200 |
| GET | `/up` | Laravel health check | 200 |

**Request fields**

- Facility: `department_id` (existing ID), `name`, `category`, `location`; optionally `condition_score` (1–5), `is_operational` (boolean), and `notes`.
- Inspection: `facility_id`, `rating` (1–5), `inspected_at` (date/time), `findings`; optionally `inspector_id` (existing user ID or null).
- Complaint: `facility_id`, `subject`, `description`, `priority` (`low`, `medium`, `high`, `urgent`), `status` (`open`, `in_progress`, `resolved`, `closed`); optionally `submitted_by` (existing user ID or null), and `reported_at` (date/time).

For example, create a facility after seeding:

```powershell
curl.exe -X POST http://127.0.0.1:8000/api/facilities `
  -H "Accept: application/json" -H "Content-Type: application/json" `
  -d '{"department_id":1,"name":"North Library","category":"Library","location":"North Campus","condition_score":4,"is_operational":true}'
```

Authentication is intentionally not applied to these learning endpoints: adding token authentication would require extra setup/dependencies and was not necessary for the CRUD exercise. The seeded user accounts and password hashing demonstrate the basic user model only. Do not expose this unauthenticated sample API to an untrusted network.

## SQL Queries

Run `sql/schema.sql` in MySQL to create the reference database, then run `sql/queries.sql` after loading the sample data with the Laravel seeder. The examples cover:

1. Employees by department (`JOIN`, `WHERE`, `ORDER BY`).
2. Average salary (overall and grouped by department).
3. Highest-paid employee (scalar subquery, including ties).
4. Poor facilities (`WHERE` and a department `JOIN`).
5. Complaint counts (`GROUP BY` and `HAVING`).
6. Inspection history (`JOIN` and `ORDER BY`).

Additional examples compare salaries against a subquery, inspect an index with `SHOW INDEX` / `EXPLAIN`, and demonstrate a transaction that is rolled back.

For the Laravel application, use its migrations as described in Installation. `schema.sql` is a standalone SQL reference for the same tables; do not apply it and the migrations to the same database. If you create the tables with `schema.sql`, use `php artisan db:seed` to load sample rows without trying to create the tables again.

## Installation

### Requirements

- PHP 8.3+ with `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, and `ctype`; `intl` is needed for formatted output in `php artisan about`.
- Composer 2.
- MySQL 8.x and a database account allowed to create/use `intern_training`.
- For automated tests: PHP extensions `pdo_sqlite`, `dom`, `xml`, and `xmlwriter`.

### MySQL database setup

Create a dedicated development database; do not use `migrate:fresh` on data you need:

```sql
CREATE DATABASE intern_training CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Environment and Composer setup

From PowerShell, create the local environment file, configure its MySQL credentials, then install the locked dependencies:

```powershell
Set-Location day-08\laravel-api
Copy-Item .env.example .env
```

The committed `composer.lock` pins dependency versions. Then initialize the application and database:

```powershell
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
```

`php artisan migrate --seed` can also run migrations and seed data together. Seeding is repeatable. `php artisan migrate:fresh --seed` drops all tables first; use it only against a disposable database. The demo inspector login seeded for local exploration is `inspector@example.com` / `password`; it is not used to authorize these endpoints and must not be used in a deployed system.

## Environment Variables

Configure these in `laravel-api/.env`:

| Variable | Example | Purpose |
|---|---|---|
| `APP_ENV` | `local` | Runtime environment |
| `APP_DEBUG` | `true` | Detailed local errors; set `false` in production |
| `APP_KEY` | generated by Artisan | Application encryption key |
| `DB_CONNECTION` | `mysql` | Database driver |
| `DB_HOST` | `127.0.0.1` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_DATABASE` | `intern_training` | Database name |
| `DB_USERNAME` / `DB_PASSWORD` | your local MySQL credentials | Database login |

Never commit `.env` or production credentials. The PHPUnit configuration overrides the connection to an in-memory SQLite database; it requires PHP’s `pdo_sqlite` extension.

## How to Run

With MySQL running and migrations/seeds complete:

```powershell
Set-Location day-08\laravel-api
php artisan serve
```

The API is available at `http://127.0.0.1:8000/api`. Browse seeded records with `GET /api/facilities`, `GET /api/inspections`, and `GET /api/complaints`.

## Testing

Run the feature suite from `laravel-api`:

```powershell
php artisan test
```

The tests exercise list, show, create, update, delete, invalid-input responses, and facility history protection for all three API resources. They use an in-memory SQLite database and do not change the configured MySQL database.

## Project Structure

```text
day-08/
├── database/ERD.md
├── sql/
│   ├── schema.sql
│   └── queries.sql
├── laravel-api/
│   ├── app/Http/Controllers/
│   ├── app/Http/Requests/
│   ├── app/Http/Resources/
│   ├── app/Models/
│   ├── database/migrations/
│   ├── database/seeders/
│   ├── routes/api.php
│   └── tests/Feature/
└── README.md
```

## Challenges Faced

- The data has multiple related records, so delete behavior needs to protect useful inspection and complaint history.
- SQL examples and Laravel migrations must describe the same keys and indexes.
- API consumers need predictable JSON for both validation and missing-record errors.

## Solutions

- Foreign keys restrict deletion of referenced departments/facilities; the facility endpoint reports a clear 409 when history exists.
- `sql/schema.sql` mirrors the migrations, and `sql/queries.sql` uses the same table and column names.
- Laravel Form Requests return 422 validation details; API exceptions are configured to render JSON, and resources keep response fields explicit.

## Future Improvements

- Add token authentication and authorization policies before exposing write routes.
- Add employee and department endpoints if the scope expands.
- Add database-backed pagination filters and API versioning when clients require them.
- Add a MySQL-backed CI job alongside the fast SQLite feature suite.