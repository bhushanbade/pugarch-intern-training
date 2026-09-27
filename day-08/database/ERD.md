# Database relationships

```mermaid
erDiagram
    DEPARTMENTS ||--o{ EMPLOYEES : employs
    DEPARTMENTS ||--o{ FACILITIES : manages
    FACILITIES ||--o{ INSPECTIONS : receives
    FACILITIES ||--o{ COMPLAINTS : receives
    USERS o|--o{ INSPECTIONS : performs
    USERS o|--o{ COMPLAINTS : submits

    DEPARTMENTS {
        bigint id PK
        string name UK
        text description
    }
    EMPLOYEES {
        bigint id PK
        bigint department_id FK
        string email UK
        decimal salary
    }
    USERS {
        bigint id PK
        string email UK
        string password
        string role
    }
    FACILITIES {
        bigint id PK
        bigint department_id FK
        string name
        tinyint condition_score
    }
    INSPECTIONS {
        bigint id PK
        bigint facility_id FK
        bigint inspector_id FK "nullable"
        tinyint rating
        timestamp inspected_at
    }
    COMPLAINTS {
        bigint id PK
        bigint facility_id FK
        bigint submitted_by FK "nullable"
        string status
        string priority
    }
```

- Deleting a department is restricted while it has employees or facilities.
- Deleting a facility is restricted while it has inspections or complaints; the API returns `409 Conflict` for this case.
- Deleting a user sets the optional inspection/complaint user reference to `NULL`, preserving records.
- Indexes cover employee department/salary, facility condition score, inspection facility/date, and complaint facility/status queries.

The Laravel migrations under `../laravel-api/database/migrations/` define the executable schema.
