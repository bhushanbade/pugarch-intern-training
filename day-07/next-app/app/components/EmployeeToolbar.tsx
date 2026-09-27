"use client";

import type { Dispatch, SetStateAction } from "react";
import { ChevronDown, RotateCcw, Search } from "lucide-react";
import styles from "./EmployeeToolbar.module.css";

type EmployeeToolbarProps = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  department: string;
  setDepartment: Dispatch<SetStateAction<string>>;
  departments: string[];
  sort: string;
  setSort: Dispatch<SetStateAction<string>>;
  filteredCount: number;
  totalCount: number;
};

export default function EmployeeToolbar({
  search,
  setSearch,
  department,
  setDepartment,
  departments,
  sort,
  setSort,
  filteredCount,
  totalCount,
}: EmployeeToolbarProps) {
  const hasActiveFilters =
    search !== "" || department !== "All" || sort !== "none";

  const clearFilters = () => {
    setSearch("");
    setDepartment("All");
    setSort("none");
  };

  return (
    <section aria-label="Search and filter employees" className={styles.toolbar}>
      <div className={styles.controls}>
        <label className={styles.searchField}>
          <Search aria-hidden="true" className={styles.searchIcon} size={18} />
          <input
            aria-label="Search employees"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search employee by name..."
            type="search"
            value={search}
          />
        </label>

        <label className={styles.selectField}>
          <span className={styles.visuallyHidden}>Filter by department</span>
          <select
            aria-label="Filter by department"
            onChange={(event) => setDepartment(event.target.value)}
            value={department}
          >
            {departments.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Departments" : item}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className={styles.selectIcon}
            size={16}
          />
        </label>

        <label className={styles.selectField}>
          <span className={styles.visuallyHidden}>Sort employees by salary</span>
          <select
            aria-label="Sort employees by salary"
            onChange={(event) => setSort(event.target.value)}
            value={sort}
          >
            <option value="none">Sort by Salary</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
          <ChevronDown
            aria-hidden="true"
            className={styles.selectIcon}
            size={16}
          />
        </label>

        {hasActiveFilters && (
          <button
            aria-label="Clear all employee search and filters"
            className={styles.clearButton}
            onClick={clearFilters}
            type="button"
          >
            <RotateCcw aria-hidden="true" size={15} />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      <p aria-live="polite" className={styles.resultSummary}>
        Showing <strong>{filteredCount}</strong> of{" "}
        <strong>{totalCount}</strong> employees
      </p>
    </section>
  );
}
