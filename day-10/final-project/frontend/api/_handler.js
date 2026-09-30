import {
  db,
  getDepartmentName,
  getFacilityName,
  getInspectorName,
  getSubmitterName,
  enrichFacility,
  enrichInspection,
  enrichComplaint,
  enrichEmployee,
  parseBody,
  sendJson,
  getStats,
  getPerformance,
} from './_db.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    return res.end();
  }

  // Extract path segments from Vercel req.query.path or req.url
  let segments = [];
  if (req.query && req.query.path) {
    if (Array.isArray(req.query.path)) {
      segments = req.query.path.filter(Boolean);
    } else if (typeof req.query.path === 'string') {
      segments = req.query.path.split('/').filter(Boolean);
    }
  }

  if (segments.length === 0) {
    const parsedUrl = new URL(req.url || '/', 'http://localhost');
    const pathname = parsedUrl.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
    if (pathname && !pathname.includes('[...path]')) {
      segments = pathname.split('/').filter(Boolean);
    }
  }

  const parsedUrl = new URL(req.url || '/', 'http://localhost');
  const query = {
    ...Object.fromEntries(parsedUrl.searchParams.entries()),
    ...(req.query || {}),
  };
  delete query.path;

  const method = req.method.toUpperCase();

  // Root or health check
  if (segments.length === 0 || segments[0] === 'health') {
    return sendJson(res, 200, { data: { status: 'ok', service: 'FacilityOps API (Vercel Serverless)' } });
  }

  // 1. Dashboard Stats
  if (segments[0] === 'dashboard' || segments[0] === 'stats') {
    return sendJson(res, 200, { data: getStats() });
  }

  // 2. Performance
  if (segments[0] === 'performance') {
    return sendJson(res, 200, { data: getPerformance() });
  }

  // 3. Departments
  if (segments[0] === 'departments') {
    const sorted = [...db.departments].sort((a, b) => a.name.localeCompare(b.name));
    return sendJson(res, 200, { data: sorted });
  }

  // 4. Inspectors
  if (segments[0] === 'inspectors') {
    const sorted = [...db.employees].sort((a, b) => a.name.localeCompare(b.name));
    return sendJson(res, 200, { data: sorted });
  }

  // 5. Users
  if (segments[0] === 'users') {
    const sorted = [...db.users].sort((a, b) => a.name.localeCompare(b.name));
    return sendJson(res, 200, { data: sorted });
  }

  // 6. Generic Resources: facilities, inspections, complaints, employees
  const resource = segments[0];
  const validResources = ['facilities', 'inspections', 'complaints', 'employees'];
  if (!validResources.includes(resource)) {
    return sendJson(res, 404, { message: `Route not found: ${segments.join('/')}` });
  }

  const items = db[resource];
  const id = segments[1] ? Number(segments[1]) : (req.query?.id ? Number(req.query.id) : null);

  // Single Item GET /api/:resource/:id
  if (id !== null && !Number.isNaN(id) && method === 'GET') {
    const found = items.find((row) => row.id === id);
    if (!found) return sendJson(res, 404, { message: `${resource} record not found.` });

    if (resource === 'facilities') {
      const facilityInspections = db.inspections.filter((i) => i.facility_id === id).map(enrichInspection);
      const facilityComplaints = db.complaints.filter((c) => c.facility_id === id).map(enrichComplaint);
      return sendJson(res, 200, { data: { ...enrichFacility(found), inspections: facilityInspections, complaints: facilityComplaints } });
    }
    if (resource === 'inspections') return sendJson(res, 200, { data: enrichInspection(found) });
    if (resource === 'complaints') return sendJson(res, 200, { data: enrichComplaint(found) });
    if (resource === 'employees') return sendJson(res, 200, { data: enrichEmployee(found) });
    return sendJson(res, 200, { data: found });
  }

  // List GET /api/:resource
  if ((id === null || Number.isNaN(id)) && method === 'GET') {
    let result = [...items];

    // Search filter
    if (query.search) {
      const term = String(query.search).toLowerCase();
      result = result.filter((row) => {
        if (resource === 'facilities') {
          return row.name.toLowerCase().includes(term) || row.category.toLowerCase().includes(term) || row.location.toLowerCase().includes(term) || getDepartmentName(row.department_id).toLowerCase().includes(term);
        }
        if (resource === 'inspections') {
          return (row.findings && row.findings.toLowerCase().includes(term)) || getFacilityName(row.facility_id).toLowerCase().includes(term) || (getInspectorName(row.inspector_id) && getInspectorName(row.inspector_id).toLowerCase().includes(term));
        }
        if (resource === 'complaints') {
          return row.subject.toLowerCase().includes(term) || row.description.toLowerCase().includes(term) || getFacilityName(row.facility_id).toLowerCase().includes(term);
        }
        if (resource === 'employees') {
          return row.name.toLowerCase().includes(term) || row.email.toLowerCase().includes(term) || row.position.toLowerCase().includes(term) || getDepartmentName(row.department_id).toLowerCase().includes(term);
        }
        return true;
      });
    }

    // Specific filters
    if (query.status) result = result.filter((r) => r.status === query.status);
    if (query.priority) result = result.filter((r) => r.priority === query.priority);
    if (query.category) result = result.filter((r) => r.category === query.category);
    if (query.department_id) result = result.filter((r) => r.department_id === Number(query.department_id));
    if (query.facility_id) result = result.filter((r) => r.facility_id === Number(query.facility_id));
    if (query.inspector_id) result = result.filter((r) => r.inspector_id === Number(query.inspector_id));
    if (query.rating) result = result.filter((r) => r.rating === Number(query.rating));

    // Sorting
    if (query.sort) {
      const key = String(query.sort);
      const asc = (query.order ?? 'asc').toLowerCase() === 'asc';
      result.sort((a, b) => {
        const valA = a[key] ?? '';
        const valB = b[key] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') return asc ? valA - valB : valB - valA;
        return asc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
      });
    }

    // Enrich rows
    let enriched = result;
    if (resource === 'facilities') enriched = result.map(enrichFacility);
    if (resource === 'inspections') enriched = result.map(enrichInspection);
    if (resource === 'complaints') enriched = result.map(enrichComplaint);
    if (resource === 'employees') enriched = result.map(enrichEmployee);

    return sendJson(res, 200, { data: enriched });
  }

  // Create POST /api/:resource
  if ((id === null || Number.isNaN(id)) && method === 'POST') {
    const body = await parseBody(req);
    const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    const newRecord = { ...body, id: nextId };

    if (resource === 'complaints') {
      newRecord.reported_at = newRecord.reported_at || new Date().toISOString().slice(0, 19).replace('T', ' ');
      if (['resolved', 'closed'].includes(newRecord.status) && !newRecord.resolved_at) {
        newRecord.resolved_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }
    }

    items.push(newRecord);

    let enriched = newRecord;
    if (resource === 'facilities') enriched = enrichFacility(newRecord);
    if (resource === 'inspections') enriched = enrichInspection(newRecord);
    if (resource === 'complaints') enriched = enrichComplaint(newRecord);
    if (resource === 'employees') enriched = enrichEmployee(newRecord);

    return sendJson(res, 201, { data: enriched, message: `${resource} record created.` });
  }

  // Update PUT or PATCH /api/:resource/:id
  if (id !== null && !Number.isNaN(id) && (method === 'PUT' || method === 'PATCH')) {
    const body = await parseBody(req);
    const index = items.findIndex((r) => r.id === id);
    if (index < 0) return sendJson(res, 404, { message: `${resource} record not found.` });

    items[index] = { ...items[index], ...body, id };

    if (resource === 'complaints' && body.status) {
      if (['resolved', 'closed'].includes(body.status)) {
        items[index].resolved_at = items[index].resolved_at || new Date().toISOString().slice(0, 19).replace('T', ' ');
      } else {
        items[index].resolved_at = null;
      }
    }

    let enriched = items[index];
    if (resource === 'facilities') enriched = enrichFacility(items[index]);
    if (resource === 'inspections') enriched = enrichInspection(items[index]);
    if (resource === 'complaints') enriched = enrichComplaint(items[index]);
    if (resource === 'employees') enriched = enrichEmployee(items[index]);

    return sendJson(res, 200, { data: enriched, message: `${resource} record updated.` });
  }

  // Delete DELETE /api/:resource/:id
  if (id !== null && !Number.isNaN(id) && method === 'DELETE') {
    const index = items.findIndex((r) => r.id === id);
    if (index < 0) return sendJson(res, 404, { message: `${resource} record not found.` });

    items.splice(index, 1);
    return sendJson(res, 200, { message: `${resource} record deleted.` });
  }

  return sendJson(res, 405, { message: `Method ${method} not allowed.` });
}
