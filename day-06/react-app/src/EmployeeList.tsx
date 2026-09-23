import type { Employee } from "./types";

interface Props {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

function EmployeeList({
  employees,
  onView,
  onEdit,
  onDelete
}: Props) {
  return (
    <div className="employee-grid">
      {employees.map(employee => (
        <div className="employee-card" key={employee.id}>
          <h3>{employee.name}</h3>

          <p>Age: {employee.age}</p>
          <p>Department: {employee.department}</p>
          <p className="salary">Salary: ₹{employee.salary}</p>

          <div className="actions">
            <button onClick={() => onView(employee)}>View</button>
            <button onClick={() => onEdit(employee)}>Edit</button>
            <button onClick={() => onDelete(employee.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EmployeeList;