"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Employee = {
  id: number;
  name: string;
  age: number;
  department: string;
  salary: number;
};

export default function EmployeeDetails() {
  const params = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/employees/${params.id}`)
      .then(response => response.json())
      .then(result => {
        setEmployee(result.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <main style={{ padding: 40 }}>Loading...</main>;
  }

  if (!employee) {
    return <main style={{ padding: 40 }}>Employee not found.</main>;
  }

  return (
    <main style={{ maxWidth: 600, margin: "50px auto", padding: 30 }}>

      <button onClick={() => router.back()}>
        ← Back
      </button>

      <h1>{employee.name}</h1>

      <p>
        <strong>Employee ID:</strong> {employee.id}
      </p>

      <p>
        <strong>Age:</strong> {employee.age}
      </p>

      <p>
        <strong>Department:</strong> {employee.department}
      </p>

      <p>
        <strong>Salary:</strong> ₹{employee.salary.toLocaleString()}
      </p>

    </main>
  );
}