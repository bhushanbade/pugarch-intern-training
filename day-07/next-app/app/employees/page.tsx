"use client";

import { useEffect, useState } from "react";
import { Building2, IndianRupee, Plus, Users } from "lucide-react";
import EmployeeDrawer, {
  type EmployeeFormErrors,
} from "../components/EmployeeDrawer";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeToolbar from "../components/EmployeeToolbar";
import StatsCard from "../components/StatsCard";
import "./employees.css";

type Employee = {
  id: number;
  name: string;
  age: number;
  department: string;
  salary: number;
};

const API = "http://localhost:5000/api/employees";

const emptyFormErrors: EmployeeFormErrors = {
  name: "",
  age: "",
  department: "",
  salary: "",
};

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
  const [formErrors, setFormErrors] =
    useState<EmployeeFormErrors>(emptyFormErrors);

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
    setFormErrors({ ...emptyFormErrors });

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
    setFormErrors({ ...emptyFormErrors });

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

  const validateField = (
    field: keyof EmployeeFormErrors,
    value: string,
  ) => {
    const trimmedValue = value.trim();

    if (field === "name") {
      return trimmedValue ? "" : "Employee name is required.";
    }

    if (field === "department") {
      return trimmedValue ? "" : "Department is required.";
    }

    if (field === "age") {
      if (!trimmedValue) {
        return "Age is required.";
      }

      const age = Number(trimmedValue);
      return Number.isFinite(age) &&
        Number.isInteger(age) &&
        age >= 18 &&
        age <= 65
        ? ""
        : "Age must be between 18 and 65.";
    }

    if (!trimmedValue) {
      return "Salary must be greater than 0.";
    }

    const salary = Number(trimmedValue);
    return Number.isFinite(salary) && salary > 0
      ? ""
      : "Salary must be greater than 0.";
  };

  const validateForm = () => ({
    name: validateField("name", form.name),
    age: validateField("age", form.age),
    department: validateField("department", form.department),
    salary: validateField("salary", form.salary),
  });

  const handleFieldChange = (
    field: keyof EmployeeFormErrors,
    value: string,
  ) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setFormErrors((currentErrors) =>
      currentErrors[field]
        ? { ...currentErrors, [field]: validateField(field, value) }
        : currentErrors,
    );
  };

  const handleFieldBlur = (field: keyof EmployeeFormErrors) => {
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateField(field, form[field]),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setFormErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
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
      setFormErrors({ ...emptyFormErrors });

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

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormErrors({ ...emptyFormErrors });
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
          type="button"
        >
          <Plus aria-hidden="true" size={16} />
          Add Employee
        </button>
      </header>

      {/* STATISTICS */}

      <section aria-label="Employee statistics" className="stats">
        <StatsCard
          title="Total Employees"
          value={employees.length}
          icon={<Users size={19} />}
          supportingText="Across your organization"
        />
        <StatsCard
          title="Average Salary"
          value={`₹${averageSalary.toLocaleString()}`}
          icon={<IndianRupee size={19} />}
          supportingText="Average per employee"
        />
        <StatsCard
          title="Departments"
          value={departments.length - 1}
          icon={<Building2 size={19} />}
          supportingText="Represented in your team"
        />
      </section>

      {/* CONTROLS */}

      <EmployeeToolbar
        search={search}
        setSearch={setSearch}
        department={department}
        setDepartment={setDepartment}
        departments={departments}
        sort={sort}
        setSort={setSort}
        filteredCount={filtered.length}
        totalCount={employees.length}
      />

      {/* EMPLOYEE LIST */}

      <section aria-label="Employees">
        <EmployeeTable
          employees={filtered}
          onEdit={openEdit}
          onDelete={deleteEmployee}
        />
      </section>

      {/* ADD / EDIT MODAL */}

      <EmployeeDrawer
        open={showForm}
        editing={editing}
        form={form}
        errors={formErrors}
        onFieldChange={handleFieldChange}
        onFieldBlur={handleFieldBlur}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

    </main>
  );
}