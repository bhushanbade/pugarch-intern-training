import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import styles from "./employee-layout.module.css";

export default function EmployeeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
