CREATE DATABASE IF NOT EXISTS intern_training
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE intern_training;

CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'inspector',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE departments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY departments_name_unique (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE employees (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    department_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    hired_on DATE NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY employees_email_unique (email),
    KEY employees_department_salary_idx (department_id, salary),
    KEY employees_salary_idx (salary),
    CONSTRAINT employees_department_id_foreign
        FOREIGN KEY (department_id) REFERENCES departments (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE facilities (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    department_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    condition_score TINYINT UNSIGNED NOT NULL DEFAULT 3,
    is_operational BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    KEY facilities_condition_score_idx (condition_score),
    KEY facilities_department_id_index (department_id),
    CONSTRAINT facilities_department_id_foreign
        FOREIGN KEY (department_id) REFERENCES departments (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inspections (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    facility_id BIGINT UNSIGNED NOT NULL,
    inspector_id BIGINT UNSIGNED NULL,
    rating TINYINT UNSIGNED NOT NULL,
    inspected_at TIMESTAMP NOT NULL,
    findings TEXT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    KEY inspections_facility_inspected_at_idx (facility_id, inspected_at),
    KEY inspections_inspector_id_index (inspector_id),
    CONSTRAINT inspections_facility_id_foreign
        FOREIGN KEY (facility_id) REFERENCES facilities (id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT inspections_inspector_id_foreign
        FOREIGN KEY (inspector_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE complaints (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    facility_id BIGINT UNSIGNED NOT NULL,
    submitted_by BIGINT UNSIGNED NULL,
    subject VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    reported_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    KEY complaints_facility_status_idx (facility_id, status),
    KEY complaints_submitted_by_index (submitted_by),
    CONSTRAINT complaints_facility_id_foreign
        FOREIGN KEY (facility_id) REFERENCES facilities (id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT complaints_submitted_by_foreign
        FOREIGN KEY (submitted_by) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
