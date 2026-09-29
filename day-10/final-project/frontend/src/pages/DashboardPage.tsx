import { useAsync } from '../hooks/useAsync';
import { getDashboardStats } from '../services/api';
import { PageTitle } from '../components/PageTitle';
import { StatusBadge } from '../components/StatusBadge';
import { Icon } from '../components/Icon';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const label = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const statusColor = (value: string) => ({
  operational: '#398365',
  maintenance: '#b27a26',
  offline: '#ad5351',
  scheduled: '#5a659f',
  completed: '#398365',
  failed: '#ad5351',
  open: '#5a659f',
  in_progress: '#b27a26',
  resolved: '#398365',
  closed: '#788397',
}[value.toLowerCase()] ?? '#5a659f');

export function DashboardPage() {
  const { data, loading, error, refresh } = useAsync(getDashboardStats);
  const facilityData = data ? Object.entries(data.facility_status).map(([name, value]) => ({ name: label(name), value })) : [];
  const inspectionData = data ? Object.entries(data.inspection_status).map(([name, value]) => ({ name: label(name), value })) : [];
  const complaintData = data ? Object.entries(data.complaint_status).map(([name, value]) => ({ name: label(name), value })) : [];

  return (
    <>
      <PageTitle eyebrow="OVERVIEW" title="Dashboard" description="Live operational status across your managed facilities." />
      {error && <div className="error-message" role="alert"><span>{error}</span><button className="text-button" onClick={() => void refresh()} type="button">Retry</button></div>}
      {loading && <p className="loading-message">Loading dashboard statistics…</p>}
      {data && <>
        <section className="metric-grid">
          <Metric title="Total facilities" value={data.total_facilities} caption="Managed locations" icon="facilities" />
          <Metric title="Total inspections" value={data.total_inspections} caption="Scheduled and completed" icon="inspections" />
          <Metric title="Total complaints" value={data.total_complaints} caption="Reported issues" icon="complaints" />
          <Metric title="Open complaints" value={data.open_complaints} caption={`${data.resolution_rate}% resolution rate`} icon="alert" />
        </section>
        <section className="chart-grid">
          <ChartCard title="Facility status" data={facilityData} />
          <ChartCard title="Inspection status" data={inspectionData} />
          <ChartCard title="Complaint status" data={complaintData} />
        </section>
        <section className="dashboard-lists">
          <RecentInspections rows={data.recent_inspections} />
          <RecentComplaints rows={data.recent_complaints} />
        </section>
      </>}
    </>
  );
}

function Metric({ title, value, caption, icon }: { title: string; value: number; caption: string; icon: 'facilities' | 'inspections' | 'complaints' | 'alert' }) {
  return <article className="metric-card"><span className="metric-icon"><Icon name={icon} size={16} /></span><p>{title}</p><strong>{value}</strong><small>{caption}</small></article>;
}

function ChartCard({ title, data }: { title: string; data: Array<{ name: string; value: number }> }) {
  return (
    <section className="surface chart-card">
      <div className="section-heading"><h2>{title}</h2><span>Database totals</span></div>
      {!data.some((item) => item.value > 0) ? <p className="empty-message">No records available.</p> : (
        <div className="chart-container">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={43} outerRadius={68} paddingAngle={3}>
                {data.map((entry) => <Cell fill={statusColor(entry.name)} key={entry.name} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      <div aria-label={`${title} chart legend`} className="chart-legend">{data.map((entry) => <span key={entry.name}><i style={{ background: statusColor(entry.name) }} />{entry.name} <b>{entry.value}</b></span>)}</div>
    </section>
  );
}

function RecentInspections({ rows }: { rows: NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>['recent_inspections'] }) {
  return (
    <section className="surface">
      <div className="section-heading"><div><h2>Recent inspections</h2><span>Latest facility checks</span></div></div>
      <div className="table-wrap"><table><thead><tr><th scope="col">Facility</th><th scope="col">Date</th><th scope="col">Inspector</th><th scope="col">Status</th></tr></thead><tbody>
        {rows.map((row) => <tr key={row.id}><td>{row.facility_name}</td><td>{formatDate(row.inspected_at)}</td><td>{row.inspector_name ?? 'Unassigned'}</td><td><StatusBadge status={row.status} /></td></tr>)}
      </tbody></table>{!rows.length && <p className="empty-message">No inspections recorded.</p>}</div>
    </section>
  );
}

function RecentComplaints({ rows }: { rows: NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>['recent_complaints'] }) {
  return (
    <section className="surface">
      <div className="section-heading"><div><h2>Recent complaints</h2><span>Latest reported issues</span></div></div>
      <div className="table-wrap"><table><thead><tr><th scope="col">Complaint</th><th scope="col">Facility</th><th scope="col">Priority</th><th scope="col">Status</th></tr></thead><tbody>
        {rows.map((row) => <tr key={row.id}><td>{row.subject}</td><td>{row.facility_name}</td><td><StatusBadge status={row.priority} /></td><td><StatusBadge status={row.status} /></td></tr>)}
      </tbody></table>{!rows.length && <p className="empty-message">No complaints reported.</p>}</div>
    </section>
  );
}

export function InspectionStatusChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return <ResponsiveContainer height={220} width="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#6457e8" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}
