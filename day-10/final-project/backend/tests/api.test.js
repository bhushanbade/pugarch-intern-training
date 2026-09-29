import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';
import { validateRecord } from '../middleware/validate.js';

function createFacilityPool() {
  const facilities = [{
    id: 1,
    department_id: 2,
    name: 'North Library',
    category: 'Library',
    location: 'North Campus',
    condition_score: 4,
    status: 'operational',
    notes: null,
    department_name: 'Operations',
  }];

  return {
    facilities,
    async execute(sql, values = []) {
      if (sql === 'SELECT 1') return [[{ ok: 1 }]];
      if (sql.includes('FROM facilities f') && sql.includes('.id = ?')) {
        const record = facilities.find((facility) => facility.id === Number(values.at(-1)));
        return [[...(record ? [record] : [])]];
      }
      if (sql.includes('FROM facilities f')) return [[...facilities]];
      if (sql.includes('FROM inspections i') || sql.includes('FROM complaints c')) return [[]];
      if (sql.startsWith('INSERT INTO facilities')) {
        const columns = sql.match(/facilities \((.*?)\)/)[1].split(', ');
        const record = Object.fromEntries(columns.map((column, index) => [column, values[index]]));
        record.id = Math.max(0, ...facilities.map((facility) => facility.id)) + 1;
        record.department_name = 'Operations';
        facilities.push(record);
        return [{ insertId: record.id }];
      }
      if (sql.startsWith('UPDATE facilities SET')) {
        const columns = sql.match(/SET (.*?) WHERE/)[1].split(', ').map((column) => column.replace(' = ?', ''));
        const id = Number(values.at(-1));
        const record = facilities.find((facility) => facility.id === id);
        if (record) columns.forEach((column, index) => { record[column] = values[index]; });
        return [{ affectedRows: record ? 1 : 0 }];
      }
      if (sql.startsWith('DELETE FROM facilities')) {
        const index = facilities.findIndex((facility) => facility.id === Number(values[0]));
        if (index < 0) return [{ affectedRows: 0 }];
        facilities.splice(index, 1);
        return [{ affectedRows: 1 }];
      }
      throw new Error(`Unexpected test query: ${sql}`);
    },
  };
}

test('facility API supports create, list, update, and delete with REST responses', async () => {
  const pool = createFacilityPool();
  const app = createApp(pool);
  const payload = {
    department_id: 2,
    name: 'East Annex',
    category: 'Office',
    location: 'East Campus',
    condition_score: 3,
    status: 'maintenance',
    notes: '',
  };

  const created = await request(app).post('/api/facilities').send(payload);
  assert.equal(created.status, 201);
  assert.equal(created.body.data.name, 'East Annex');
  const id = created.body.data.id;

  const list = await request(app).get('/api/facilities?search=East&status=maintenance');
  assert.equal(list.status, 200);
  assert.ok(list.body.data.some((facility) => facility.name === 'East Annex'));

  const updated = await request(app).patch(`/api/facilities/${id}`).send({ status: 'offline' });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.data.status, 'offline');

  const deleted = await request(app).delete(`/api/facilities/${id}`);
  assert.equal(deleted.status, 200);
  assert.equal(pool.facilities.some((facility) => facility.id === id), false);
});

test('API rejects invalid records and unsupported list filters with friendly JSON', async () => {
  const app = createApp(createFacilityPool());
  const invalidFacility = await request(app).post('/api/facilities').send({ name: '' });
  assert.equal(invalidFacility.status, 422);
  assert.ok(invalidFacility.body.errors.name);

  const invalidFilter = await request(app).get('/api/facilities?sort=unsafe_column');
  assert.equal(invalidFilter.status, 400);
  assert.equal(typeof invalidFilter.body.message, 'string');

  const missing = await request(app).get('/api/facilities/999');
  assert.equal(missing.status, 404);
  assert.equal(missing.body.message, 'facilities record not found.');
});

test('complaint and inspection validation checks dates, statuses, priorities, and email', () => {
  assert.throws(() => validateRecord('complaints', {
    facility_id: 1,
    subject: 'Broken lock',
    description: 'The entrance lock is broken.',
    priority: 'urgent',
    status: 'waiting',
    reported_at: 'not-a-date',
  }), (error) => error.type === 'validation'
    && Boolean(error.errors.priority)
    && Boolean(error.errors.status)
    && Boolean(error.errors.reported_at));

  assert.throws(() => validateRecord('employees', {
    department_id: 1,
    name: 'Taylor Example',
    email: 'invalid-email',
    position: 'Manager',
    hired_on: '2026-10-01',
  }), (error) => error.type === 'validation' && Boolean(error.errors.email));

  const inspection = validateRecord('inspections', {
    facility_id: 1,
    inspector_id: null,
    rating: null,
    status: 'scheduled',
    inspected_at: '2026-10-22T10:00',
    findings: 'Scheduled safety inspection.',
  });
  assert.equal(inspection.inspected_at, '2026-10-22 10:00:00');

  assert.throws(() => validateRecord('inspections', {
    facility_id: 1,
    status: 'scheduled',
    inspected_at: '2026-02-30T10:00',
    findings: 'Invalid date.',
  }), (error) => error.type === 'validation' && Boolean(error.errors.inspected_at));
});

test('dashboard stats are aggregated from database query results', async () => {
  const pool = {
    async execute(sql) {
      if (sql.startsWith('SELECT COUNT(*) AS total FROM facilities')) return [[{ total: 4 }]];
      if (sql.startsWith('SELECT COUNT(*) AS total FROM inspections')) return [[{ total: 8 }]];
      if (sql.startsWith('SELECT COUNT(*) AS total FROM complaints WHERE status IN')) {
        return [[{ total: sql.includes("'open'") ? 3 : 2 }]];
      }
      if (sql.startsWith('SELECT COUNT(*) AS total FROM complaints')) return [[{ total: 5 }]];
      if (sql.startsWith('SELECT status, COUNT(*) AS total FROM facilities')) return [[{ status: 'operational', total: 3 }, { status: 'offline', total: 1 }]];
      if (sql.startsWith('SELECT status, COUNT(*) AS total FROM inspections')) return [[{ status: 'completed', total: 7 }, { status: 'scheduled', total: 1 }]];
      if (sql.startsWith('SELECT status, COUNT(*) AS total FROM complaints')) return [[{ status: 'open', total: 2 }, { status: 'resolved', total: 2 }, { status: 'in_progress', total: 1 }]];
      if (sql.includes('FROM inspections i')) return [[{ id: 1, facility_name: 'Central Library', inspector_name: 'Jordan Lee' }]];
      if (sql.includes('FROM complaints c')) return [[{ id: 2, facility_name: 'Civic Hall', subject: 'Leaking roof' }]];
      throw new Error(`Unexpected test query: ${sql}`);
    },
  };

  const response = await request(createApp(pool)).get('/api/dashboard/stats');
  assert.equal(response.status, 200);
  assert.equal(response.body.data.total_facilities, 4);
  assert.equal(response.body.data.total_inspections, 8);
  assert.equal(response.body.data.total_complaints, 5);
  assert.equal(response.body.data.open_complaints, 3);
  assert.equal(response.body.data.resolution_rate, 40);
  assert.equal(response.body.data.facility_status.operational, 3);
  assert.equal(response.body.data.inspection_status.scheduled, 1);
  assert.equal(response.body.data.recent_inspections[0].facility_name, 'Central Library');
});
