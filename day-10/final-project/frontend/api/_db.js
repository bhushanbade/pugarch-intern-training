// Shared in-memory database store for Vercel Serverless Functions
const initialDepartments = [
  { id: 1, name: 'Operations', description: 'Coordinates facility operations.' },
  { id: 2, name: 'Maintenance', description: 'Maintains buildings and equipment.' },
  { id: 3, name: 'Community Services', description: 'Supports community facilities.' },
];

const initialUsers = [
  { id: 1, name: 'Jordan Lee', email: 'jordan.lee@facilityops.local', role: 'inspector' },
  { id: 2, name: 'Sam Rivera', email: 'sam.rivera@facilityops.local', role: 'staff' },
  { id: 3, name: 'Asha Patel', email: 'asha.patel@facilityops.local', role: 'manager' },
];

const initialEmployees = [
  { id: 1, department_id: 1, name: 'Asha Patel', email: 'asha.employee@facilityops.local', position: 'Operations Manager', hired_on: '2021-04-12' },
  { id: 2, department_id: 2, name: 'Mina Chen', email: 'mina.chen@facilityops.local', position: 'Maintenance Engineer', hired_on: '2020-09-21' },
  { id: 3, department_id: 3, name: 'Luis Garcia', email: 'luis.garcia@facilityops.local', position: 'Building Technician', hired_on: '2023-06-19' },
];

const initialFacilities = [
  { id: 1, department_id: 1, name: 'Central Library', category: 'Library', location: '100 Main Street', condition_score: 4, status: 'operational', notes: 'Routine service in good condition.' },
  { id: 2, department_id: 2, name: 'Civic Hall', category: 'Government', location: '25 Civic Plaza', condition_score: 2, status: 'maintenance', notes: 'Water damage near east stairwell.' },
  { id: 3, department_id: 3, name: 'East Community Center', category: 'Community', location: '80 East Avenue', condition_score: 3, status: 'operational', notes: null },
  { id: 4, department_id: 2, name: 'Riverside Pool', category: 'Recreation', location: '12 River Road', condition_score: 1, status: 'offline', notes: 'Filtration system repair in progress.' },
];

const initialInspections = [
  { id: 1, facility_id: 1, inspector_id: 1, rating: 4, status: 'completed', inspected_at: '2026-07-12 10:30:00', findings: 'Lighting repaired; inspected areas are in good condition.' },
  { id: 2, facility_id: 2, inspector_id: 1, rating: 2, status: 'completed', inspected_at: '2026-08-18 08:45:00', findings: 'Water damage found near the east stairwell.' },
  { id: 3, facility_id: 3, inspector_id: 1, rating: 3, status: 'completed', inspected_at: '2026-08-22 13:15:00', findings: 'Replace two worn door closers.' },
  { id: 4, facility_id: 4, inspector_id: 1, rating: 1, status: 'failed', inspected_at: '2026-09-06 07:30:00', findings: 'Filtration system is offline; restrict access pending repair.' },
  { id: 5, facility_id: 1, inspector_id: 1, rating: null, status: 'scheduled', inspected_at: '2026-10-03 09:00:00', findings: 'Quarterly safety inspection.' },
];

const initialComplaints = [
  { id: 1, facility_id: 2, submitted_by: 2, subject: 'Repair east stairwell water damage', description: 'Water is entering after heavy rain.', priority: 'high', status: 'open', reported_at: '2026-09-09 09:10:00', resolved_at: null, resolution_notes: null },
  { id: 2, facility_id: 2, submitted_by: 2, subject: 'Inspect ceiling above meeting room', description: 'A ceiling tile is stained and should be checked.', priority: 'medium', status: 'in_progress', reported_at: '2026-09-12 15:45:00', resolved_at: null, resolution_notes: null },
  { id: 3, facility_id: 3, submitted_by: 2, subject: 'Replace worn door closer', description: 'The side entrance does not close reliably.', priority: 'low', status: 'resolved', reported_at: '2026-09-10 10:00:00', resolved_at: '2026-09-15 11:30:00', resolution_notes: 'Replaced and tested the door closer.' },
  { id: 4, facility_id: 4, submitted_by: 2, subject: 'Restore pool filtration system', description: 'The filtration system is offline; the pool should remain closed.', priority: 'critical', status: 'open', reported_at: '2026-09-16 08:00:00', resolved_at: null, resolution_notes: null },
  { id: 5, facility_id: 1, submitted_by: 2, subject: 'Add a reading-room light', description: 'One reading-room fixture is flickering.', priority: 'low', status: 'closed', reported_at: '2026-09-04 12:30:00', resolved_at: '2026-09-06 14:15:00', resolution_notes: 'Replaced the faulty fixture.' },
];

export const db = {
  departments: structuredClone(initialDepartments),
  users: structuredClone(initialUsers),
  employees: structuredClone(initialEmployees),
  facilities: structuredClone(initialFacilities),
  inspections: structuredClone(initialInspections),
  complaints: structuredClone(initialComplaints),
};

export function getDepartmentName(deptId) {
  return db.departments.find((d) => d.id === Number(deptId))?.name ?? 'Unknown';
}

export function getFacilityName(facId) {
  return db.facilities.find((f) => f.id === Number(facId))?.name ?? 'Unknown';
}

export function getInspectorName(inspectorId) {
  return db.employees.find((e) => e.id === Number(inspectorId))?.name ?? null;
}

export function getSubmitterName(userId) {
  return db.users.find((u) => u.id === Number(userId))?.name ?? null;
}

export function enrichFacility(f) {
  return { ...f, department_name: getDepartmentName(f.department_id) };
}

export function enrichInspection(i) {
  return {
    ...i,
    facility_name: getFacilityName(i.facility_id),
    inspector_name: getInspectorName(i.inspector_id),
  };
}

export function enrichComplaint(c) {
  return {
    ...c,
    facility_name: getFacilityName(c.facility_id),
    submitter_name: getSubmitterName(c.submitted_by),
  };
}

export function enrichEmployee(e) {
  return { ...e, department_name: getDepartmentName(e.department_id) };
}

export function parseBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string' && req.body.length > 0) {
    try { return Promise.resolve(JSON.parse(req.body)); } catch { return Promise.resolve({}); }
  }
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

export function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.end(JSON.stringify(payload));
}

export function getStats() {
  const totalFacilities = db.facilities.length;
  const totalInspections = db.inspections.length;
  const totalComplaints = db.complaints.length;
  const openComplaints = db.complaints.filter((c) => ['open', 'in_progress'].includes(c.status)).length;
  const resolvedComplaints = db.complaints.filter((c) => ['resolved', 'closed'].includes(c.status)).length;

  const facilityStatus = { operational: 0, maintenance: 0, offline: 0 };
  db.facilities.forEach((f) => { if (facilityStatus[f.status] !== undefined) facilityStatus[f.status]++; });

  const inspectionStatus = { scheduled: 0, completed: 0, failed: 0 };
  db.inspections.forEach((i) => { if (inspectionStatus[i.status] !== undefined) inspectionStatus[i.status]++; });

  const complaintStatus = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
  db.complaints.forEach((c) => { if (complaintStatus[c.status] !== undefined) complaintStatus[c.status]++; });

  const recentInspections = [...db.inspections]
    .sort((a, b) => new Date(b.inspected_at) - new Date(a.inspected_at))
    .slice(0, 5)
    .map(enrichInspection);

  const recentComplaints = [...db.complaints]
    .sort((a, b) => new Date(b.reported_at) - new Date(a.reported_at))
    .slice(0, 5)
    .map(enrichComplaint);

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
}

export function getPerformance() {
  return db.facilities.map((f) => {
    const facInspections = db.inspections.filter((i) => i.facility_id === f.id);
    const facComplaints = db.complaints.filter((c) => c.facility_id === f.id);
    const completedRatings = facInspections.filter((i) => i.status === 'completed' && typeof i.rating === 'number').map((i) => i.rating);
    const averageRating = completedRatings.length > 0 ? Math.round((completedRatings.reduce((sum, r) => sum + r, 0) / completedRatings.length) * 100) / 100 : null;
    const openCount = facComplaints.filter((c) => ['open', 'in_progress'].includes(c.status)).length;
    const resolvedCount = facComplaints.filter((c) => ['resolved', 'closed'].includes(c.status)).length;
    const totalC = facComplaints.length;

    return {
      facility_id: f.id,
      facility_name: f.name,
      department_name: getDepartmentName(f.department_id),
      condition_score: f.condition_score,
      status: f.status,
      inspection_count: facInspections.length,
      average_rating: averageRating,
      complaint_count: totalC,
      open_complaints: openCount,
      resolved_complaints: resolvedCount,
      resolution_rate: totalC === 0 ? null : Math.round((resolvedCount / totalC) * 1000) / 10,
    };
  });
}
