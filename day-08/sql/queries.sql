USE intern_training;

-- Employees by department: JOIN, WHERE, and ORDER BY.
SELECT e.id, e.name, e.position, e.salary, d.name AS department
FROM employees AS e
JOIN departments AS d ON d.id = e.department_id
WHERE d.name = 'Operations'
ORDER BY e.salary DESC, e.name ASC;

-- Average salary overall.
SELECT ROUND(AVG(salary), 2) AS average_salary
FROM employees;

-- Average salary per department: GROUP BY.
SELECT d.name AS department, ROUND(AVG(e.salary), 2) AS average_salary
FROM departments AS d
JOIN employees AS e ON e.department_id = d.id
GROUP BY d.id, d.name
ORDER BY average_salary DESC;

-- All highest-paid employees, including ties (scalar subquery).
SELECT e.id, e.name, e.position, e.salary, d.name AS department
FROM employees AS e
JOIN departments AS d ON d.id = e.department_id
WHERE e.salary = (SELECT MAX(salary) FROM employees)
ORDER BY e.name;

-- Employees earning above the overall average (subquery).
SELECT name, position, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;

-- Poor facilities (condition score 1 or 2), with their department.
SELECT f.id, f.name, f.category, f.location, f.condition_score,
       d.name AS department
FROM facilities AS f
JOIN departments AS d ON d.id = f.department_id
WHERE f.condition_score <= 2
ORDER BY f.condition_score ASC, f.name ASC;

-- Complaint counts by facility; HAVING filters aggregate results.
SELECT f.id, f.name, COUNT(c.id) AS complaint_count
FROM facilities AS f
LEFT JOIN complaints AS c ON c.facility_id = f.id
GROUP BY f.id, f.name
HAVING COUNT(c.id) > 0
ORDER BY complaint_count DESC, f.name ASC;

-- Inspection history for one facility; change 1 to another facility ID as needed.
SELECT i.id, f.name AS facility, u.name AS inspector, i.rating,
       i.inspected_at, i.findings
FROM inspections AS i
JOIN facilities AS f ON f.id = i.facility_id
LEFT JOIN users AS u ON u.id = i.inspector_id
WHERE f.id = 1
ORDER BY i.inspected_at DESC;

-- Inspect available indexes and the query plan for a poor-facility lookup.
SHOW INDEX FROM facilities;
EXPLAIN
SELECT id, name, condition_score
FROM facilities
WHERE condition_score = 1;

-- Demonstrate a transaction safely: inspect the temporary value, then roll it back.
START TRANSACTION;
UPDATE facilities
SET condition_score = LEAST(condition_score + 1, 5)
WHERE id = 1;
SELECT id, name, condition_score FROM facilities WHERE id = 1;
ROLLBACK;
