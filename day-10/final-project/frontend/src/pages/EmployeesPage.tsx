import { useEffect, useState } from 'react';
import { ResourcePage, type ResourceDefinition } from '../components/ResourcePage';
import type { Department } from '../types';
import { api, friendlyError } from '../services/api';

export function EmployeesPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get<{ data: Department[] }>('/departments').then((response) => setDepartments(response.data.data))
      .catch((cause: unknown) => setError(friendlyError(cause)));
  }, []);
  const definition: ResourceDefinition = {
    resource: 'employees',
    title: 'Employees',
    description: 'View team members and the departments they support.',
    searchKeys: ['name', 'email', 'position', 'department_name'],
    fields: [
      { name: 'name', label: 'Full name', required: true, maxLength: 150 },
      { name: 'email', label: 'Email address', type: 'email', required: true, maxLength: 255 },
      { name: 'position', label: 'Position', required: true, maxLength: 120 },
      { name: 'department_id', label: 'Department', type: 'select', required: true, options: departments.map((row) => ({ value: row.id, label: row.name })) },
      { name: 'hired_on', label: 'Hire date', type: 'date', required: true },
    ],
    columns: [
      { key: 'name', label: 'Employee' },
      { key: 'email', label: 'Email' },
      { key: 'position', label: 'Position' },
      { key: 'department_name', label: 'Department' },
      { key: 'hired_on', label: 'Hire date' },
    ],
  };
  return <><ResourcePage definition={definition} />{error && <p className="reference-warning">{error}</p>}</>;
}
