import { useMemo, useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getPerformance } from '../services/api';
import { PageTitle } from '../components/PageTitle';
import { StatusBadge } from '../components/StatusBadge';

export function PerformancePage() {
  const { data, loading, error, refresh } = useAsync(getPerformance);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('open_complaints');
  const visible = useMemo(() => (data ?? [])
    .filter((row) => `${row.facility_name} ${row.department_name}`.toLowerCase().includes(search.toLowerCase()))
    .sort((first, second) => Number(second[sort as keyof typeof second] ?? -1) - Number(first[sort as keyof typeof first] ?? -1)), [data, search, sort]);

  return <>
    <PageTitle eyebrow="OPERATIONS ANALYTICS" title="Facility performance" description="Compare asset condition, inspection results, and complaint resolution from actual database records." />
    <section className="surface">
      <div className="toolbar"><input aria-label="Search performance" onChange={(event) => setSearch(event.target.value)} placeholder="Search facility or department" value={search} /><select aria-label="Sort performance" onChange={(event) => setSort(event.target.value)} value={sort}><option value="open_complaints">Open complaints</option><option value="average_rating">Average rating</option><option value="condition_score">Condition</option><option value="inspection_count">Inspection count</option></select></div>
      {error && <div className="error-message" role="alert"><span>{error}</span><button className="text-button" onClick={() => void refresh()} type="button">Retry</button></div>}
      {loading ? <p className="loading-message">Loading performance data…</p> : <>
        <div className="table-wrap"><table><thead><tr><th>Facility</th><th>Department</th><th>State</th><th>Condition</th><th>Inspections</th><th>Average rating</th><th>Open complaints</th><th>Resolution rate</th></tr></thead><tbody>{visible.map((row) => <tr key={row.facility_id}><td>{row.facility_name}</td><td>{row.department_name}</td><td><StatusBadge status={row.status} /></td><td>{row.condition_score} / 5</td><td>{row.inspection_count}</td><td>{row.average_rating == null ? '—' : `${row.average_rating} / 5`}</td><td>{row.open_complaints} / {row.complaint_count}</td><td>{row.resolution_rate == null ? '—' : `${row.resolution_rate}%`}</td></tr>)}</tbody></table>{!visible.length && <p className="empty-message">No performance data matches.</p>}</div>
      </>}
    </section>
  </>;
}
