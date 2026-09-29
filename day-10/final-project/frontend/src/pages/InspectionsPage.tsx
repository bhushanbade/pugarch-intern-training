import { useEffect, useState } from 'react';
import { ResourcePage, type ResourceDefinition } from '../components/ResourcePage';
import type { Facility, UserSummary } from '../types';
import { api, friendlyError } from '../services/api';
import { useParams } from 'react-router-dom';

export function InspectionsPage() {
  const { id } = useParams();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([
      api.get<{ data: Facility[] }>('/facilities'),
      api.get<{ data: UserSummary[] }>('/inspectors'),
    ]).then(([facilityResponse, userResponse]) => {
      setFacilities(facilityResponse.data.data);
      setUsers(userResponse.data.data);
    }).catch((cause: unknown) => setError(friendlyError(cause)));
  }, []);

  const definition: ResourceDefinition = {
    resource: 'inspections',
    title: 'Inspections',
    description: 'Schedule and review facility inspection history and findings.',
    searchKeys: ['facility_name', 'inspector_name', 'findings', 'status'],
    filterKey: 'status',
    filterOptions: [{ value: 'scheduled', label: 'Scheduled' }, { value: 'completed', label: 'Completed' }, { value: 'failed', label: 'Failed' }],
    additionalFilters: [{ key: 'rating', label: 'Rating', options: [1, 2, 3, 4, 5].map((value) => ({ value: String(value), label: `${value} / 5` })) }],
    sortOptions: [
      { value: 'inspected_at:desc', label: 'Date newest first' }, { value: 'inspected_at:asc', label: 'Date oldest first' },
      { value: 'rating:asc', label: 'Rating low–high' }, { value: 'rating:desc', label: 'Rating high–low' },
      { value: 'status:asc', label: 'Status' },
    ],
    fields: [
      { name: 'facility_id', label: 'Facility', type: 'select', required: true, options: facilities.map((row) => ({ value: row.id, label: row.name })) },
      { name: 'inspector_id', label: 'Inspector', type: 'select', options: [{ value: '', label: 'Unassigned' }, ...users.map((row) => ({ value: row.id, label: row.name }))] },
      { name: 'status', label: 'Status', type: 'select', required: true, options: [{ value: 'scheduled', label: 'Scheduled' }, { value: 'completed', label: 'Completed' }, { value: 'failed', label: 'Failed' }] },
      { name: 'rating', label: 'Rating (1–5, optional if scheduled)', type: 'number', min: 1, max: 5 },
      { name: 'inspected_at', label: 'Inspection date', type: 'datetime-local', required: true },
      { name: 'findings', label: 'Findings', type: 'textarea', required: true, maxLength: 16000 },
    ],
    columns: [
      { key: 'facility_name', label: 'Facility' },
      { key: 'inspected_at', label: 'Inspection date', render: (row) => formatDate(String(row.inspected_at)) },
      { key: 'inspector_name', label: 'Inspector' },
      { key: 'status', label: 'Status' },
      { key: 'rating', label: 'Rating', render: (row) => row.rating == null ? '—' : `${row.rating} / 5` },
      { key: 'findings', label: 'Findings' },
    ],
  };
  return <><ResourcePage definition={definition} detailId={id ? Number(id) : undefined} />{error && <p className="reference-warning">{error}</p>}</>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
