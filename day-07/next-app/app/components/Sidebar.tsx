"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  Menu,
  Settings,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className={styles.mobileHeader}>
        <button
          aria-label="Open navigation menu"
          aria-controls="employee-sidebar"
          aria-expanded={isOpen}
          className={styles.menuButton}
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <Menu aria-hidden="true" size={20} />
        </button>
        <div className={styles.mobileBrand}>
          <Building2 aria-hidden="true" size={19} />
          <span>PeopleOS</span>
        </div>
      </header>

      {isOpen && (
        <button
          aria-label="Close navigation menu"
          className={styles.scrim}
          onClick={() => setIsOpen(false)}
          type="button"
        />
      )}

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
        id="employee-sidebar"
      >
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <Building2 aria-hidden="true" size={20} />
          </div>
          <div className={styles.brandCopy}>
            <span className={styles.brandName}>PeopleOS</span>
            <span className={styles.brandSubtitle}>WORKSPACE</span>
          </div>
          <button
            aria-label="Close navigation menu"
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            type="button"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <div className={styles.sectionLabel}>WORKSPACE</div>
        <nav aria-label="Main navigation" className={styles.navigation}>
          <div aria-disabled="true" className={styles.navItem}>
            <LayoutDashboard aria-hidden="true" size={19} />
            <span>Dashboard</span>
          </div>
          <Link
            aria-current="page"
            className={`${styles.navItem} ${styles.navItemActive}`}
            href="/employees"
            onClick={() => setIsOpen(false)}
          >
            <UsersRound aria-hidden="true" size={19} />
            <span>Employees</span>
            <span className={styles.activeIndicator} />
          </Link>
          <div aria-disabled="true" className={styles.navItem}>
            <Settings aria-hidden="true" size={19} />
            <span>Settings</span>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.footerDivider} />
          <div className={styles.profile}>
            <div className={styles.avatar}>
              <UserRound aria-hidden="true" size={19} />
            </div>
            <div className={styles.profileCopy}>
              <span className={styles.profileName}>Workspace Admin</span>
              <span className={styles.profileRole}>Administrator</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
