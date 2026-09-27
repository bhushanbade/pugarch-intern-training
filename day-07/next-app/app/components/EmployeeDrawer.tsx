"use client";

import {
  useEffect,
  useRef,
  type FormEvent,
} from "react";
import { X } from "lucide-react";
import styles from "./EmployeeDrawer.module.css";

type Employee = {
  id: number;
  name: string;
  age: number;
  department: string;
  salary: number;
};

type EmployeeForm = {
  name: string;
  age: string;
  department: string;
  salary: string;
};

export type EmployeeFormErrors = Record<keyof EmployeeForm, string>;

type EmployeeDrawerProps = {
  open: boolean;
  editing: Employee | null;
  form: EmployeeForm;
  errors: EmployeeFormErrors;
  onFieldChange: (field: keyof EmployeeForm, value: string) => void;
  onFieldBlur: (field: keyof EmployeeForm) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function EmployeeDrawer({
  open,
  editing,
  form,
  errors,
  onFieldChange,
  onFieldBlur,
  onSubmit,
  onClose,
}: EmployeeDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused = document.activeElement;
    const firstInput = drawerRef.current?.querySelector<HTMLElement>("input");
    firstInput?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements.item(0);
        const lastElement = focusableElements.item(focusableElements.length - 1);

        if (
          event.shiftKey &&
          (document.activeElement === firstElement ||
            !drawerRef.current.contains(document.activeElement))
        ) {
          event.preventDefault();
          lastElement?.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === lastElement ||
            !drawerRef.current.contains(document.activeElement))
        ) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="presentation"
    >
      <section
        aria-labelledby="employee-drawer-title"
        aria-modal="true"
        className={styles.drawer}
        onClick={(event) => event.stopPropagation()}
        ref={drawerRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>EMPLOYEE MANAGEMENT</p>
            <h2 id="employee-drawer-title">
              {editing ? "Edit Employee" : "Add Employee"}
            </h2>
            <p className={styles.description}>
              {editing
                ? "Update this employee's information."
                : "Add a new member to your organization."}
            </p>
          </div>
          <button
            aria-label="Close employee form"
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={19} />
          </button>
        </header>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.fields}>
            <label className={styles.field}>
              <span>Employee Name</span>
              <input
                aria-describedby={
                  errors.name ? "employee-name-error" : undefined
                }
                aria-invalid={Boolean(errors.name)}
                autoComplete="name"
                onBlur={() => onFieldBlur("name")}
                onChange={(event) =>
                  onFieldChange("name", event.target.value)
                }
                placeholder="e.g. Rahul Sharma"
                type="text"
                value={form.name}
              />
              {errors.name && (
                <span className={styles.fieldError} id="employee-name-error">
                  {errors.name}
                </span>
              )}
            </label>

            <label className={styles.field}>
              <span>Age</span>
              <input
                aria-describedby={errors.age ? "employee-age-error" : undefined}
                aria-invalid={Boolean(errors.age)}
                onBlur={() => onFieldBlur("age")}
                onChange={(event) =>
                  onFieldChange("age", event.target.value)
                }
                placeholder="e.g. 28"
                type="number"
                value={form.age}
              />
              {errors.age && (
                <span className={styles.fieldError} id="employee-age-error">
                  {errors.age}
                </span>
              )}
            </label>

            <label className={styles.field}>
              <span>Department</span>
              <input
                aria-describedby={
                  errors.department ? "employee-department-error" : undefined
                }
                aria-invalid={Boolean(errors.department)}
                onBlur={() => onFieldBlur("department")}
                onChange={(event) =>
                  onFieldChange("department", event.target.value)
                }
                placeholder="e.g. Engineering"
                type="text"
                value={form.department}
              />
              {errors.department && (
                <span
                  className={styles.fieldError}
                  id="employee-department-error"
                >
                  {errors.department}
                </span>
              )}
            </label>

            <label className={styles.field}>
              <span>Salary</span>
              <div className={styles.salaryInput}>
                <span aria-hidden="true">₹</span>
                <input
                  aria-describedby={
                    errors.salary ? "employee-salary-error" : undefined
                  }
                  aria-invalid={Boolean(errors.salary)}
                  onBlur={() => onFieldBlur("salary")}
                  onChange={(event) =>
                    onFieldChange("salary", event.target.value)
                  }
                  placeholder="e.g. 45000"
                  type="number"
                  value={form.salary}
                />
              </div>
              {errors.salary && (
                <span className={styles.fieldError} id="employee-salary-error">
                  {errors.salary}
                </span>
              )}
            </label>
          </div>

          <footer className={styles.actions}>
            <button
              className={styles.cancelButton}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button className={styles.submitButton} type="submit">
              {editing ? "Update Employee" : "Add Employee"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
