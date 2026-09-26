"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./employees.css";

type Employee = {
  id: number;
  name: string;
  age: number;
  department: string;
  salary: number;
};

const API = "http://localhost:5000/api/employees";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [sort, setSort] = useState("none");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    department: "",
    salary: "",
  });

  // =========================
  // GET EMPLOYEES
  // =========================

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const result = await response.json();

      setEmployees(result.data);
      setError("");
    } catch {
      setError("Unable to connect to Employee API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // =========================
  // DEPARTMENTS
  // =========================

  const departments = [
    "All",
    ...new Set(employees.map((employee) => employee.department)),
  ];

  // =========================
  // SEARCH
  // =========================

  let filtered = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // DEPARTMENT FILTER
  // =========================

  if (department !== "All") {
    filtered = filtered.filter(
      (employee) => employee.department === department
    );
  }

  // =========================
  // SORT
  // =========================

  if (sort === "low") {
    filtered = [...filtered].sort((a, b) => a.salary - b.salary);
  }

  if (sort === "high") {
    filtered = [...filtered].sort((a, b) => b.salary - a.salary);
  }

  // =========================
  // STATISTICS
  // =========================

  const averageSalary = employees.length
    ? Math.round(
        employees.reduce(
          (sum, employee) => sum + employee.salary,
          0
        ) / employees.length
      )
    : 0;

  // =========================
  // OPEN ADD FORM
  // =========================

  const openAdd = () => {
    setEditing(null);

    setForm({
      name: "",
      age: "",
      department: "",
      salary: "",
    });

    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================

  const openEdit = (employee: Employee) => {
    setEditing(employee);

    setForm({
      name: employee.name,
      age: String(employee.age),
      department: employee.department,
      salary: String(employee.salary),
    });

    setShowForm(true);
  };

  // =========================
  // FORM SUBMIT
  // =========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.age ||
      !form.department.trim() ||
      !form.salary
    ) {
      alert("Please fill all fields");
      return;
    }

    const employeeData = {
      name: form.name.trim(),
      age: Number(form.age),
      department: form.department.trim(),
      salary: Number(form.salary),
    };

    try {
      const response = await fetch(
        editing ? `${API}/${editing.id}` : API,
        {
          method: editing ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(employeeData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Operation failed");
        return;
      }

      setShowForm(false);
      setEditing(null);

      setForm({
        name: "",
        age: "",
        department: "",
        salary: "",
      });

      await loadEmployees();
    } catch {
      alert("Unable to connect to API");
    }
  };

  // =========================
  // DELETE EMPLOYEE
  // =========================

  const deleteEmployee = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      await loadEmployees();
    } catch {
      alert("Unable to delete employee");
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return <div className="error">{error}</div>;
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="dashboard">

      {/* HEADER */}

      <header className="header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage your organization's employees</p>
        </div>

        <button
          className="add-btn"
          onClick={openAdd}
        >
          + Add Employee
        </button>
      </header>

      {/* STATISTICS */}

      <section className="stats">

        <div className="stat-card">
          <span>Total Employees</span>
          <strong>{employees.length}</strong>
        </div>

        <div className="stat-card">
          <span>Average Salary</span>

          <strong>
            ₹{averageSalary.toLocaleString()}
          </strong>
        </div>

        <div className="stat-card">
          <span>Departments</span>

          <strong>
            {departments.length - 1}
          </strong>
        </div>

      </section>

      {/* CONTROLS */}

      <section className="controls">

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          {departments.map((dept) => (
            <option
              key={dept}
              value={dept}
            >
              {dept === "All"
                ? "All Departments"
                : dept}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="none">
            Sort by Salary
          </option>

          <option value="low">
            Salary: Low to High
          </option>

          <option value="high">
            Salary: High to Low
          </option>
        </select>

      </section>

      {/* EMPLOYEE LIST */}

      <section className="employee-grid">

        {filtered.length === 0 ? (
          <div className="empty">
            No employees found.
          </div>
        ) : (
          filtered.map((employee) => (

            <article
              className="employee-card"
              key={employee.id}
            >

              {/* EMPLOYEE INFO */}

              <div className="employee-info">

                <div className="avatar">
                  {employee.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2>{employee.name}</h2>
                  <p>{employee.department}</p>
                </div>

              </div>

              {/* DETAILS */}

              <div className="details">

                <span>
                  Age: {employee.age}
                </span>

                <strong>
                  ₹{employee.salary.toLocaleString()}
                </strong>

              </div>

              {/* ACTIONS */}

              <div className="actions">

                <Link
                  href={`/employees/${employee.id}`}
                >
                  <button className="view-btn">
                    View
                  </button>
                </Link>

                <button
                  className="edit-btn"
                  onClick={() => openEdit(employee)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteEmployee(employee.id)
                  }
                >
                  Delete
                </button>

              </div>

            </article>

          ))
        )}

      </section>

      {/* ADD / EDIT MODAL */}

      {showForm && (

        <div className="modal-overlay">

          <form
            className="modal"
            onSubmit={handleSubmit}
          >

            <h2>
              {editing
                ? "Edit Employee"
                : "Add Employee"}
            </h2>

            {/* NAME */}

            <input
              type="text"
              placeholder="Employee name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            {/* AGE */}

            <input
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) =>
                setForm({
                  ...form,
                  age: e.target.value,
                })
              }
            />

            {/* DEPARTMENT */}

            <input
              type="text"
              placeholder="Department"
              value={form.department}
              onChange={(e) =>
                setForm({
                  ...form,
                  department: e.target.value,
                })
              }
            />

            {/* SALARY */}

            <input
              type="number"
              placeholder="Salary"
              value={form.salary}
              onChange={(e) =>
                setForm({
                  ...form,
                  salary: e.target.value,
                })
              }
            />

            {/* MODAL ACTIONS */}

            <div className="modal-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
              >
                {editing ? "Update" : "Add"}
              </button>

            </div>

          </form>

        </div>

      )}

    </main>
  );
}