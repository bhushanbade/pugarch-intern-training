import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import styles from "./EmployeeTable.module.css";

type Employee = {
  id: number;
  name: string;
  age: number;
  department: string;
  salary: number;
};

type EmployeeTableProps = {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
};

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>No employees found</h2>
        <p>Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.numberHeader} scope="col">
              #
            </th>
            <th scope="col">Name</th>
            <th scope="col">Department</th>
            <th scope="col">Age</th>
            <th scope="col">Salary</th>
            <th className={styles.actionsHeader} scope="col">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className={styles.employeeNumber} data-label="#">
                {employee.id}
              </td>
              <td data-label="Name">
                <div className={styles.employee}>
                  <span aria-hidden="true" className={styles.avatar}>
                    {employee.name.charAt(0).toUpperCase()}
                  </span>
                  <span className={styles.employeeName}>{employee.name}</span>
                </div>
              </td>
              <td data-label="Department">
                <span className={styles.department}>
                  {employee.department}
                </span>
              </td>
              <td data-label="Age">{employee.age}</td>
              <td className={styles.salary} data-label="Salary">
                ₹{employee.salary.toLocaleString()}
              </td>
              <td className={styles.actionsCell} data-label="Actions">
                <div className={styles.actions}>
                  <Link
                    aria-label={`View ${employee.name}`}
                    className={styles.actionButton}
                    href={`/employees/${employee.id}`}
                    title="View employee"
                  >
                    <Eye aria-hidden="true" size={17} />
                  </Link>
                  <button
                    aria-label={`Edit ${employee.name}`}
                    className={styles.actionButton}
                    onClick={() => onEdit(employee)}
                    title="Edit employee"
                    type="button"
                  >
                    <Pencil aria-hidden="true" size={16} />
                  </button>
                  <button
                    aria-label={`Delete ${employee.name}`}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => onDelete(employee.id)}
                    title="Delete employee"
                    type="button"
                  >
                    <Trash2 aria-hidden="true" size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
