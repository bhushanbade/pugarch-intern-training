import { useEffect, useState } from 'react';
import { ResourcePage, type ResourceDefinition } from '../components/ResourcePage';
import type { Facility } from '../types';
import { api, friendlyError } from '../services/api';
import { useParams } from 'react-router-dom';

const priorities = ['low', 'medium', 'high', 'critical'];
const statuses = ['open', 'in_progress', 'resolved', 'closed'];

export function ComplaintsPage() {
  const { id } = useParams();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get<{ data: Facility[] }>('/facilities').then((response) => setFacilities(response.data.data))
      .catch((cause: unknown) => setError(friendlyError(cause)));
  }, []);

  const definition: ResourceDefinition = {
    resource: 'complaints',
    title: 'Complaints',
    description: 'Track facility issues, priorities, statuses, and resolution details.',
    searchKeys: ['subject', 'facility_name', 'description', 'status', 'priority'],
    filterKey: 'status',
    filterOptions: statuses.map((value) => ({ value, label: label(value) })),
    additionalFilters: [{ key: 'priority', label: 'Priority', options: priorities.map((value) => ({ value, label: label(value) })) }],
    sortOptions: [
      { value: 'reported_at:desc', label: 'Date newest first' }, { value: 'reported_at:asc', label: 'Date oldest first' },
      { value: 'priority:desc', label: 'Priority high–low' }, { value: 'priority:asc', label: 'Priority low–high' },
      { value: 'status:asc', label: 'Status' },
    ],
    fields: [
      { name: 'facility_id', label: 'Facility', type: 'select', required: true, options: facilities.map((row) => ({ value: row.id, label: row.name })) },
      { name: 'subject', label: 'Subject', required: true, maxLength: 180 },
      { name: 'description', label: 'Description', type: 'textarea', required: true, maxLength: 16000 },
      { name: 'priority', label: 'Priority', type: 'select', required: true, options: priorities.map((value) => ({ value, label: label(value) })) },
      { name: 'status', label: 'Status', type: 'select', required: true, options: statuses.map((value) => ({ value, label: label(value) })) },
      { name: 'reported_at', label: 'Reported date', type: 'datetime-local', required: true },
      { name: 'resolution_notes', label: 'Resolution information', type: 'textarea', maxLength: 16000 },
    ],
    columns: [
      { key: 'subject', label: 'Complaint' },
      { key: 'facility_name', label: 'Facility' },
      { key: 'priority', label: 'Priority' },
      { key: 'status', label: 'Status' },
      { key: 'reported_at', label: 'Reported', render: (row) => formatDate(String(row.reported_at)) },
      { key: 'resolved_at', label: 'Resolved', render: (row) => row.resolved_at ? formatDate(String(row.resolved_at)) : '—' },
      { key: 'resolution_notes', label: 'Resolution information' },
    ],
  };
  return <><ResourcePage definition={definition} detailId={id ? Number(id) : undefined} />{error && <p className="reference-warning">{error}</p>}</>;
}

function label(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
