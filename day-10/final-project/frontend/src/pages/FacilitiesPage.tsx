import { useEffect, useState } from 'react';
import { ResourcePage, type ResourceDefinition } from '../components/ResourcePage';
import type { Department } from '../types';
import { api, friendlyError } from '../services/api';
import { useParams } from 'react-router-dom';

export function FacilitiesPage() {
  const { id } = useParams();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get<{ data: Department[] }>('/departments').then((response) => setDepartments(response.data.data))
      .catch((cause: unknown) => setError(friendlyError(cause)));
  }, []);

  const definition: ResourceDefinition = {
    resource: 'facilities',
    title: 'Facilities',
    description: 'Manage facility locations, operating status, and condition.',
    searchKeys: ['name', 'category', 'location', 'department_name'],
    filterKey: 'status',
    filterOptions: [
      { value: 'operational', label: 'Operational' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'offline', label: 'Offline' },
    ],
    sortOptions: [
      { value: 'name:asc', label: 'Name A–Z' }, { value: 'name:desc', label: 'Name Z–A' },
      { value: 'condition_score:asc', label: 'Condition low–high' }, { value: 'condition_score:desc', label: 'Condition high–low' },
      { value: 'status:asc', label: 'Status' },
    ],
    fields: [
      { name: 'name', label: 'Facility name', required: true, maxLength: 150 },
      { name: 'department_id', label: 'Department', type: 'select', required: true, options: departments.map((row) => ({ value: row.id, label: row.name })) },
      { name: 'category', label: 'Category', required: true, maxLength: 100 },
      { name: 'location', label: 'Location', required: true, maxLength: 255 },
      { name: 'condition_score', label: 'Condition (1–5)', type: 'number', required: true, min: 1, max: 5 },
      { name: 'status', label: 'Status', type: 'select', required: true, options: [
        { value: 'operational', label: 'Operational' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'offline', label: 'Offline' },
      ] },
      { name: 'notes', label: 'Notes', type: 'textarea', maxLength: 16000 },
    ],
    columns: [
      { key: 'name', label: 'Facility' },
      { key: 'category', label: 'Category' },
      { key: 'location', label: 'Location' },
      { key: 'department_name', label: 'Department' },
      { key: 'condition_score', label: 'Condition' },
      { key: 'status', label: 'Status' },
    ],
    relatedDetails: (row) => (
      <div className="related-grid">
        <section><h3>Inspection history ({relatedRows(row, 'inspections').length})</h3>
          {relatedRows(row, 'inspections').map((inspection) => <p className="related-item" key={String(inspection.id)}>{formatDate(String(inspection.inspected_at))} · {String(inspection.status)} · {String(inspection.inspector_name ?? 'Unassigned')}<br />{String(inspection.findings)}</p>)}
          {!relatedRows(row, 'inspections').length && <p className="empty-message">No related inspections.</p>}
        </section>
        <section><h3>Complaints ({relatedRows(row, 'complaints').length})</h3>
          {relatedRows(row, 'complaints').map((complaint) => <p className="related-item" key={String(complaint.id)}>{String(complaint.subject)} · {String(complaint.priority)} · {String(complaint.status)}</p>)}
          {!relatedRows(row, 'complaints').length && <p className="empty-message">No related complaints.</p>}
        </section>
      </div>
    ),
  };
  return <><ResourcePage definition={definition} detailId={id ? Number(id) : undefined} />{error && <p className="reference-warning">{error}</p>}</>;
}

function relatedRows(row: Record<string, unknown>, key: string): Array<Record<string, unknown>> {
  const value = row[key];
  return Array.isArray(value) ? value as Array<Record<string, unknown>> : [];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}
