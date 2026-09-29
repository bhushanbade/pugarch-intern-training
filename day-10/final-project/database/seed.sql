USE facility_ops;

INSERT INTO departments (name, description) VALUES
('Operations', 'Coordinates facility operations.'),
('Maintenance', 'Maintains buildings and equipment.'),
('Community Services', 'Supports community facilities.');

INSERT INTO users (name, email, password_hash, role) VALUES
('Jordan Lee', 'jordan.lee@facilityops.local', NULL, 'inspector'),
('Sam Rivera', 'sam.rivera@facilityops.local', NULL, 'staff'),
('Asha Patel', 'asha.patel@facilityops.local', NULL, 'manager');

INSERT INTO employees (department_id, name, email, position, hired_on) VALUES
(1, 'Asha Patel', 'asha.employee@facilityops.local', 'Operations Manager', '2021-04-12'),
(2, 'Mina Chen', 'mina.chen@facilityops.local', 'Maintenance Engineer', '2020-09-21'),
(3, 'Luis Garcia', 'luis.garcia@facilityops.local', 'Building Technician', '2023-06-19');

INSERT INTO facilities (department_id, name, category, location, condition_score, status, notes) VALUES
(1, 'Central Library', 'Library', '100 Main Street', 4, 'operational', 'Routine service in good condition.'),
(2, 'Civic Hall', 'Government', '25 Civic Plaza', 2, 'maintenance', 'Water damage near east stairwell.'),
(3, 'East Community Center', 'Community', '80 East Avenue', 3, 'operational', NULL),
(2, 'Riverside Pool', 'Recreation', '12 River Road', 1, 'offline', 'Filtration system repair in progress.');

INSERT INTO inspections (facility_id, inspector_id, rating, status, inspected_at, findings) VALUES
(1, 1, 4, 'completed', '2026-07-12 10:30:00', 'Lighting repaired; inspected areas are in good condition.'),
(2, 1, 2, 'completed', '2026-08-18 08:45:00', 'Water damage found near the east stairwell.'),
(3, 1, 3, 'completed', '2026-08-22 13:15:00', 'Replace two worn door closers.'),
(4, 1, 1, 'failed', '2026-09-06 07:30:00', 'Filtration system is offline; restrict access pending repair.'),
(1, 1, NULL, 'scheduled', '2026-10-03 09:00:00', 'Quarterly safety inspection.');

INSERT INTO complaints (facility_id, submitted_by, subject, description, priority, status, reported_at, resolved_at, resolution_notes) VALUES
(2, 2, 'Repair east stairwell water damage', 'Water is entering after heavy rain.', 'high', 'open', '2026-09-09 09:10:00', NULL, NULL),
(2, 2, 'Inspect ceiling above meeting room', 'A ceiling tile is stained and should be checked.', 'medium', 'in_progress', '2026-09-12 15:45:00', NULL, NULL),
(3, 2, 'Replace worn door closer', 'The side entrance does not close reliably.', 'low', 'resolved', '2026-09-10 10:00:00', '2026-09-15 11:30:00', 'Replaced and tested the door closer.'),
(4, 2, 'Restore pool filtration system', 'The filtration system is offline; the pool should remain closed.', 'critical', 'open', '2026-09-16 08:00:00', NULL, NULL),
(1, 2, 'Add a reading-room light', 'One reading-room fixture is flickering.', 'low', 'closed', '2026-09-04 12:30:00', '2026-09-06 14:15:00', 'Replaced the faulty fixture.');
