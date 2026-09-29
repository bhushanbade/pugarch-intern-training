# FacilityOps MySQL database

The Day 10 database is defined directly by [`schema.sql`](./schema.sql) and [`seed.sql`](./seed.sql); it does not reuse executable Day 8 migrations. Day 8's SQL schema and ERD were inspected as a starting point, but its source files remain unchanged.

The schema creates `facility_ops` and the six required tables: users, departments, employees, facilities, inspections, and complaints. Departments are related to employees and facilities; facilities are related to inspections and complaints; inspectors reference employees; optional complaint submitters reference users. Foreign keys, unique employee emails, enums, timestamps, indexes, and condition/rating checks protect the main records.

Complaint status is `open`, `in_progress`, `resolved`, or `closed`; priority is `low`, `medium`, `high`, or `critical`. Resolution timestamps and notes are kept with each complaint. Inspection status is `scheduled`, `completed`, or `failed`; only completed/failed inspections require a rating.

## Initialize the database

With MySQL running, use the SQL client:

```sh
mysql -u root -p < schema.sql
mysql -u root -p facility_ops < seed.sql
```

The sample users are submitter/reference records only; the project does not implement authentication. Do not use the local sample data or demo credentials in production.

See [`ERD.md`](./ERD.md) for the relationship diagram.
