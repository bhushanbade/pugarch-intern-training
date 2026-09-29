const statuses = {
  facilities: ['operational', 'maintenance', 'offline'],
  inspections: ['scheduled', 'completed', 'failed'],
  complaints: ['open', 'in_progress', 'resolved', 'closed'],
};

async function count(pool, table, where = '', values = []) {
  const [rows] = await pool.execute(`SELECT COUNT(*) AS total FROM ${table} ${where}`, values);
  return Number(rows[0].total);
}

async function groupedCounts(pool, table) {
  const [rows] = await pool.execute(`SELECT status, COUNT(*) AS total FROM ${table} GROUP BY status`);
  const counts = Object.fromEntries(statuses[table].map((status) => [status, 0]));
  for (const row of rows) counts[row.status] = Number(row.total);
  return counts;
}

export function createDashboardService(pool) {
  return {
    async getStats() {
      const [totalFacilities, totalInspections, totalComplaints, openComplaints, resolvedComplaints, facilityStatus, inspectionStatus, complaintStatus] =
        await Promise.all([
          count(pool, 'facilities'),
          count(pool, 'inspections'),
          count(pool, 'complaints'),
          count(pool, 'complaints', "WHERE status IN ('open', 'in_progress')"),
          count(pool, 'complaints', "WHERE status IN ('resolved', 'closed')"),
          groupedCounts(pool, 'facilities'),
          groupedCounts(pool, 'inspections'),
          groupedCounts(pool, 'complaints'),
        ]);
      const [[recentInspections], [recentComplaints]] = await Promise.all([
        pool.execute(
          `SELECT i.*, f.name AS facility_name, e.name AS inspector_name
           FROM inspections i JOIN facilities f ON f.id = i.facility_id
           LEFT JOIN employees e ON e.id = i.inspector_id
           ORDER BY i.inspected_at DESC LIMIT 5`,
        ),
        pool.execute(
          `SELECT c.*, f.name AS facility_name
           FROM complaints c JOIN facilities f ON f.id = c.facility_id
           ORDER BY c.reported_at DESC LIMIT 5`,
        ),
      ]);
      return {
        total_facilities: totalFacilities,
        total_inspections: totalInspections,
        total_complaints: totalComplaints,
        open_complaints: openComplaints,
        resolved_complaints: resolvedComplaints,
        resolution_rate: totalComplaints === 0 ? 0 : Math.round((resolvedComplaints / totalComplaints) * 1000) / 10,
        facility_status: facilityStatus,
        inspection_status: inspectionStatus,
        complaint_status: complaintStatus,
        recent_inspections: recentInspections,
        recent_complaints: recentComplaints,
      };
    },
    async getPerformance() {
      const [rows] = await pool.execute(
        `SELECT f.id AS facility_id, f.name AS facility_name, d.name AS department_name,
                f.condition_score, f.status,
                COUNT(DISTINCT i.id) AS inspection_count,
                ROUND(AVG(CASE WHEN i.status = 'completed' THEN i.rating END), 2) AS average_rating,
                COUNT(DISTINCT c.id) AS complaint_count,
                COUNT(DISTINCT CASE WHEN c.status IN ('open', 'in_progress') THEN c.id END) AS open_complaints,
                COUNT(DISTINCT CASE WHEN c.status IN ('resolved', 'closed') THEN c.id END) AS resolved_complaints
         FROM facilities f
         JOIN departments d ON d.id = f.department_id
         LEFT JOIN inspections i ON i.facility_id = f.id
         LEFT JOIN complaints c ON c.facility_id = f.id
         GROUP BY f.id, f.name, d.name, f.condition_score, f.status
         ORDER BY f.name`,
      );
      return rows.map((row) => {
        const complaintCount = Number(row.complaint_count);
        const resolvedComplaints = Number(row.resolved_complaints);
        return {
          ...row,
          inspection_count: Number(row.inspection_count),
          complaint_count: complaintCount,
          open_complaints: Number(row.open_complaints),
          resolved_complaints: resolvedComplaints,
          resolution_rate: complaintCount === 0 ? null : Math.round((resolvedComplaints / complaintCount) * 1000) / 10,
        };
      });
    },
  };
}
