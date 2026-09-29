import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecord, deleteRecord, friendlyError, getRecord, listRecords, updateRecord } from '../services/api';
import type { ResourceName } from '../types';
import { PageTitle } from './PageTitle';
import { StatusBadge } from './StatusBadge';
import { ModalForm, type FormField } from './ModalForm';

export interface ResourceColumn {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => ReactNode;
}

interface ResourceRecord extends Record<string, unknown> {
  id: number;
}

export interface ResourceDefinition {
  resource: ResourceName;
  title: string;
  description: string;
  fields: FormField[];
  columns: ResourceColumn[];
  searchKeys: string[];
  filterKey?: string;
  filterOptions?: Array<{ value: string; label: string }>;
  additionalFilters?: Array<{ key: string; label: string; options: Array<{ value: string; label: string }> }>;
  sortOptions?: Array<{ value: string; label: string }>;
  relatedDetails?: (row: Record<string, unknown>) => ReactNode;
}

function singularLabel(title: string): string {
  return title === 'Facilities' ? 'Facility' : title.slice(0, -1);
}

export function ResourcePage({ definition, detailId }: { definition: ResourceDefinition; detailId?: number }) {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ResourceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Record<string, string>>({});
  const [sort, setSort] = useState(definition.sortOptions?.[0]?.value ?? 'name:asc');
  const [form, setForm] = useState<'create' | 'edit' | null>(null);
  const [selected, setSelected] = useState<ResourceRecord | null>(null);
  const [detail, setDetail] = useState<ResourceRecord | null>(null);
  const [detailError, setDetailError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      setRows(await listRecords(definition.resource));
    } catch (cause) {
      setError(friendlyError(cause));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { void load(); }, [definition.resource]);
  useEffect(() => {
    if (!detailId) return;
    setDetail(null);
    setDetailError('');
    getRecord<ResourceRecord>(definition.resource, detailId)
      .then(setDetail)
      .catch((cause: unknown) => setDetailError(friendlyError(cause)));
  }, [detailId, definition.resource]);

  async function showDetails(row: Record<string, unknown>) {
    navigate(`/${definition.resource}/${Number(row.id)}`);
    setDetail(null);
    setDetailError('');
    try {
      setDetail(await getRecord<ResourceRecord>(definition.resource, Number(row.id)));
    } catch (cause) {
      setDetailError(friendlyError(cause));
    }
  }

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = rows.filter((row) => (
      (!query || definition.searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(query)))
      && (!filter[definition.filterKey ?? 'status'] || String(row[definition.filterKey ?? 'status']) === filter[definition.filterKey ?? 'status'])
      && (definition.additionalFilters ?? []).every((item) => !filter[item.key] || String(row[item.key]) === filter[item.key])
    ));
    const [key, direction] = sort.split(':');
    return filtered.sort((a, b) => {
      const av = a[key] ?? '';
      const bv = b[key] ?? '';
      const result = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return direction === 'desc' ? -result : result;
    });
  }, [rows, search, filter, sort, definition]);

  async function save(payload: Record<string, unknown>) {
    if (form === 'edit' && selected) {
      const updated = await updateRecord<ResourceRecord>(definition.resource, Number(selected.id), payload);
      setRows((current) => current.map((row) => row.id === updated.id ? updated : row));
      setMessage('Changes saved.');
    } else {
      const created = await createRecord<ResourceRecord>(definition.resource, payload);
      setRows((current) => [created, ...current]);
      setMessage('Record created.');
    }
    setForm(null);
    setSelected(null);
  }

  async function remove(row: ResourceRecord) {
    if (!window.confirm(`Delete ${String(row.name ?? row.subject ?? `record #${row.id}`)}? This action cannot be undone.`)) return;
    try {
      await deleteRecord(definition.resource, Number(row.id));
      setRows((current) => current.filter((entry) => entry.id !== row.id));
      setMessage('Record deleted.');
      setError('');
    } catch (cause) {
      setError(friendlyError(cause));
    }
  }

  return (
    <>
      <PageTitle title={definition.title} description={definition.description} action={<button className="button button-primary" onClick={() => { setSelected(null); setForm('create'); setMessage(''); }} type="button">＋ Add {singularLabel(definition.title)}</button>} />
      <section className="surface">
        <div className="toolbar">
          <label className="search-box"><span aria-hidden="true">⌕</span><input onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${definition.title.toLowerCase()}…`} type="search" value={search} /></label>
          {definition.filterOptions && <select aria-label={`Filter ${definition.title}`} onChange={(event) => setFilter((current) => ({ ...current, [definition.filterKey ?? 'status']: event.target.value }))} value={filter[definition.filterKey ?? 'status'] ?? ''}><option value="">All statuses</option>{definition.filterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>}
          {(definition.additionalFilters ?? []).map((item) => <select aria-label={item.label} key={item.key} onChange={(event) => setFilter((current) => ({ ...current, [item.key]: event.target.value }))} value={filter[item.key] ?? ''}><option value="">All {item.label.toLowerCase()}</option>{item.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>)}
          <select aria-label={`Sort ${definition.title}`} onChange={(event) => setSort(event.target.value)} value={sort}>{(definition.sortOptions ?? [{ value: 'name:asc', label: 'Name A–Z' }, { value: 'name:desc', label: 'Name Z–A' }, { value: 'id:desc', label: 'Recently added' }]).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
        </div>
        {message && <p className="success-message" role="status">{message}</p>}
        {(error || detailError) && <div className="error-message" role="alert"><span>{detailError || error}</span><button className="text-button" onClick={() => { setDetailError(''); void load(); }} type="button">Retry</button></div>}
        {loading ? <p className="loading-message">Loading records…</p> : (
          <div className="table-wrap">
            <table><thead><tr>{definition.columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}<th scope="col">Actions</th></tr></thead>
              <tbody>{visible.map((row) => <tr key={String(row.id)}>
                {definition.columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : column.key === 'status' || column.key === 'priority' ? <StatusBadge status={String(row[column.key] ?? '—')} /> : String(row[column.key] ?? '—')}</td>)}
                <td><div className="actions"><button className="text-button" onClick={() => void showDetails(row)} type="button">View</button><button className="text-button" onClick={() => { setSelected(row); setForm('edit'); setMessage(''); }} type="button">Edit</button><button className="text-button danger" onClick={() => void remove(row)} type="button">Delete</button></div></td>
              </tr>)}</tbody>
            </table>
            {!visible.length && <p className="empty-message">{rows.length ? 'No records match the current search or filter.' : 'No records found. Add the first record to get started.'}</p>}
          </div>
        )}
        {!loading && <p className="table-footnote">Showing {visible.length} of {rows.length} records</p>}
      </section>
      {form && <ModalForm title={form === 'create' ? `Add ${singularLabel(definition.title)}` : `Edit ${singularLabel(definition.title)}`} fields={definition.fields} initial={selected ?? undefined} onClose={() => setForm(null)} onSubmit={save} />}
      {detail && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetail(null); }}><section aria-modal="true" className="modal-card" role="dialog"><div className="modal-header"><h2>{String(detail.name ?? detail.subject ?? `${definition.title.slice(0, -1)} details`)}</h2><button className="icon-button" onClick={() => { setDetail(null); navigate(`/${definition.resource}`); }} type="button">×</button></div><div className="detail-grid">{definition.columns.map((column) => <div className="detail-field" key={column.key}><span>{column.label}</span><strong>{column.render ? column.render(detail) : String(detail[column.key] ?? '—')}</strong></div>)}</div>{definition.relatedDetails?.(detail)}</section></div>}
    {detailId && detailError && <section className="surface"><p className="error-message" role="alert">{detailError}</p></section>}
    </>
  );
}
