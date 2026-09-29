CREATE DATABASE IF NOT EXISTS facility_ops
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE facility_ops;

CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    role ENUM('admin', 'manager', 'inspector', 'staff') NOT NULL DEFAULT 'staff',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE departments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE employees (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    position VARCHAR(120) NOT NULL,
    hired_on DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT employees_department_fk FOREIGN KEY (department_id) REFERENCES departments(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX employees_department_idx (department_id)
) ENGINE=InnoDB;

CREATE TABLE facilities (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    condition_score TINYINT UNSIGNED NOT NULL DEFAULT 3,
    status ENUM('operational', 'maintenance', 'offline') NOT NULL DEFAULT 'operational',
    notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT facilities_department_fk FOREIGN KEY (department_id) REFERENCES departments(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT facilities_condition_chk CHECK (condition_score BETWEEN 1 AND 5),
    INDEX facilities_status_idx (status),
    INDEX facilities_condition_idx (condition_score),
    INDEX facilities_department_idx (department_id)
) ENGINE=InnoDB;

CREATE TABLE inspections (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    facility_id BIGINT UNSIGNED NOT NULL,
    inspector_id BIGINT UNSIGNED NULL,
    rating TINYINT UNSIGNED NULL,
    status ENUM('scheduled', 'completed', 'failed') NOT NULL DEFAULT 'completed',
    inspected_at DATETIME NOT NULL,
    findings TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT inspections_facility_fk FOREIGN KEY (facility_id) REFERENCES facilities(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT inspections_inspector_fk FOREIGN KEY (inspector_id) REFERENCES employees(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT inspections_rating_chk CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
    INDEX inspections_facility_date_idx (facility_id, inspected_at),
    INDEX inspections_status_idx (status)
) ENGINE=InnoDB;

CREATE TABLE complaints (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    facility_id BIGINT UNSIGNED NOT NULL,
    submitted_by BIGINT UNSIGNED NULL,
    subject VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    status ENUM('open', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'open',
    reported_at DATETIME NOT NULL,
    resolved_at DATETIME NULL,
    resolution_notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT complaints_facility_fk FOREIGN KEY (facility_id) REFERENCES facilities(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT complaints_submitter_fk FOREIGN KEY (submitted_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX complaints_facility_status_idx (facility_id, status),
    INDEX complaints_status_date_idx (status, reported_at),
    INDEX complaints_priority_idx (priority)
) ENGINE=InnoDB;
