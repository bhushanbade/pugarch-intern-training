"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import styles from "./employee-details.module.css";

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
    return <main className={styles.loading}>Loading...</main>;
  }

  if (!employee) {
    return <main className={styles.notFound}>Employee not found.</main>;
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div>
          <p className={styles.eyebrow}>Employee directory</p>
          <h1 className={styles.pageTitle}>Employee details</h1>
        </div>
        <button
          className={styles.backButton}
          onClick={() => router.back()}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back
        </button>
      </header>

      <section aria-label="Employee profile" className={styles.profileCard}>
        <div aria-hidden="true" className={styles.avatar}>
          {employee.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className={styles.name}>{employee.name}</h2>
          <span className={styles.department}>{employee.department}</span>
        </div>
      </section>

      <section aria-labelledby="employee-information" className={styles.detailsCard}>
        <h2 className={styles.detailsTitle} id="employee-information">
          Employee information
        </h2>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Employee ID</span>
          <span className={styles.detailValue}>{employee.id}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Age</span>
          <span className={styles.detailValue}>{employee.age}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Department</span>
          <span className={styles.detailValue}>{employee.department}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Salary</span>
          <span className={styles.detailValue}>
            ₹{employee.salary.toLocaleString()}
          </span>
        </div>
      </section>
    </main>
  );
}