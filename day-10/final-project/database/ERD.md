# FacilityOps database relationships

```mermaid
erDiagram
  DEPARTMENTS ||--o{ EMPLOYEES : employs
  DEPARTMENTS ||--o{ FACILITIES : manages
  FACILITIES ||--o{ INSPECTIONS : receives
  FACILITIES ||--o{ COMPLAINTS : receives
  EMPLOYEES o|--o{ INSPECTIONS : performs
  USERS o|--o{ COMPLAINTS : submits
```

`schema.sql` creates the executable MySQL schema. Foreign keys restrict deleting departments or facilities with dependent records. Optional user references become null if a user is deleted. Status and priority columns use MySQL enums; timestamps and indexes are included for related history and status lookups.
