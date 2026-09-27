import type { ReactNode } from "react";
import styles from "./StatsCard.module.css";

type StatsCardProps = {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  supportingText?: string;
};

export default function StatsCard({
  title,
  value,
  icon,
  supportingText,
}: StatsCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.title}>{title}</span>
        <span aria-hidden="true" className={styles.icon}>
          {icon}
        </span>
      </div>
      <strong className={styles.value}>{value}</strong>
      {supportingText && (
        <span className={styles.supportingText}>{supportingText}</span>
      )}
    </article>
  );
}
