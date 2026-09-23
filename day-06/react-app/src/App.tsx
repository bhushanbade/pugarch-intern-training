import { useEffect, useState } from "react";
import EmployeeList from "./EmployeeList";
import type { Employee } from "./types";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [sort, setSort] = useState("none");

  // GET - Load employees from API
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(data => {
        const employeeData = data.map((user: any) => ({
          id: user.id,
          name: user.name,
          age: 25,
          department: user.company.name,
          salary: 35000 + user.id * 2500
        }));

        setEmployees(employeeData);
      })
      .catch(error => {
        console.error("API Error:", error);
      });
  }, []);

  // Get unique departments
  const departments = [
    ...new Set(employees.map(employee => employee.department))
  ];

  // Search
  let filtered = employees.filter(employee =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  // Department filter
  if (department !== "All") {
    filtered = filtered.filter(
      employee => employee.department === department
    );
  }

  // Salary sorting
  if (sort === "low") {
    filtered.sort((a, b) => a.salary - b.salary);
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.salary - a.salary);
  }

  // POST - Add employee
  const addEmployee = () => {
    const name = prompt("Enter employee name:");

    if (!name) return;

    const newEmployee = {
      name,
      age: 25,
      department: "IT",
      salary: 40000
    };

    fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newEmployee)
    })
      .then(response => response.json())
      .then(data => {
        const employee: Employee = {
          id: data.id,
          name: data.name,
          age: data.age,
          department: data.department,
          salary: data.salary
        };

        setEmployees([...employees, employee]);
      })
      .catch(error => {
        console.error("Add employee error:", error);
      });
  };

  // DELETE - Currently local
  const deleteEmployee = (id: number) => {
  if (!confirm("Delete this employee?")) return;

  fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: "DELETE"
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      setEmployees(
        employees.filter(employee => employee.id !== id)
      );
    })
    .catch(error => {
      console.error("Delete employee error:", error);
    });
};

  // EDIT - Currently local
  const editEmployee = (employee: Employee) => {
  const name = prompt("Enter new name:", employee.name);

  if (!name) return;

  const updatedEmployee = {
    ...employee,
    name
  };

  fetch(`https://jsonplaceholder.typicode.com/users/${employee.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedEmployee)
  })
    .then(response => response.json())
    .then(data => {
      setEmployees(
        employees.map(item =>
          item.id === employee.id
            ? { ...item, name: data.name }
            : item
        )
      );
    })
    .catch(error => {
      console.error("Edit employee error:", error);
    });
};

  // VIEW employee
  const viewEmployee = (employee: Employee) => {
    alert(
      `Name: ${employee.name}\n` +
      `Age: ${employee.age}\n` +
      `Department: ${employee.department}\n` +
      `Salary: ₹${employee.salary}`
    );
  };

  // Average salary
  const averageSalary = employees.length
    ? employees.reduce(
        (sum, employee) => sum + employee.salary,
        0
      ) / employees.length
    : 0;

  return (
    <main className="app">

      {/* Header */}

      <header className="header">
        <h1>Employee Management Dashboard</h1>
        <p>Manage and view employee information</p>
      </header>

      {/* Statistics */}

      <section className="stats">

        <div className="card">
          <h3>Total Employees</h3>
          <p>{employees.length}</p>
        </div>

        <div className="card">
          <h3>Average Salary</h3>
          <p>₹{Math.round(averageSalary)}</p>
        </div>

        <div className="card">
          <h3>Departments</h3>
          <p>{departments.length}</p>
        </div>

      </section>

      {/* Employee Directory */}

      <section className="employee-section">

        <h2>Employee Directory</h2>

        <div className="controls">

          {/* Search */}

          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={event =>
              setSearch(event.target.value)
            }
          />

          {/* Department */}

          <select
            value={department}
            onChange={event =>
              setDepartment(event.target.value)
            }
          >
            <option value="All">
              All Departments
            </option>

            {departments.map(item => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          {/* Sort */}

          <select
            value={sort}
            onChange={event =>
              setSort(event.target.value)
            }
          >
            <option value="none">
              Sort by Salary
            </option>

            <option value="low">
              Low to High
            </option>

            <option value="high">
              High to Low
            </option>
          </select>

          {/* Add */}

          <button onClick={addEmployee}>
            + Add Employee
          </button>

        </div>

        {/* Employee List */}

        <EmployeeList
          employees={filtered}
          onView={viewEmployee}
          onEdit={editEmployee}
          onDelete={deleteEmployee}
        />

      </section>

    </main>
  );
}

export default App;