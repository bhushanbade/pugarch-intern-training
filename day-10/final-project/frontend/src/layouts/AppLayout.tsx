import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { StatusBadge } from '../components/StatusBadge';
import { friendlyError, listRecords } from '../services/api';
import type { Complaint, ResourceName } from '../types';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/facilities', label: 'Facilities', icon: 'facilities' },
  { to: '/inspections', label: 'Inspections', icon: 'inspections' },
  { to: '/complaints', label: 'Complaints', icon: 'complaints' },
  { to: '/employees', label: 'Employees', icon: 'employees' },
  { to: '/performance', label: 'Facility performance', icon: 'performance' },
] as const;

const searchResources: Array<{ resource: ResourceName; path: string; name: string; detail: string }> = [
  { resource: 'facilities', path: '/facilities', name: 'name', detail: 'location' },
  { resource: 'inspections', path: '/inspections', name: 'facility_name', detail: 'findings' },
  { resource: 'complaints', path: '/complaints', name: 'subject', detail: 'facility_name' },
  { resource: 'employees', path: '/employees', name: 'name', detail: 'position' },
];
const resourceLabels: Record<ResourceName, string> = {
  facilities: 'Facility',
  inspections: 'Inspection',
  complaints: 'Complaint',
  employees: 'Employee',
};

interface SearchResult {
  id: number;
  label: string;
  detail: string;
  path: string;
  kind: ResourceName;
  status?: string;
}

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [openComplaints, setOpenComplaints] = useState<Complaint[]>([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentPage = links.find((link) => location.pathname.startsWith(link.to))?.label ?? 'Dashboard';

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInput.current?.focus();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      setSearchError('');
      return;
    }
    let active = true;
    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchError('');
      try {
        const responses = await Promise.all(searchResources.map(async (item) => ({
          item,
          rows: await listRecords<Record<string, unknown>>(item.resource, { search: term }),
        })));
        if (active) {
          setResults(responses.flatMap(({ item, rows }) => rows.slice(0, 4).map((row) => ({
            id: Number(row.id),
            label: String(row[item.name] ?? item.resource),
            detail: String(row[item.detail] ?? ''),
            path: `${item.path}/${Number(row.id)}`,
            kind: item.resource,
            status: typeof row.status === 'string' ? row.status : undefined,
          }))).slice(0, 8));
        }
      } catch (cause) {
        if (active) setSearchError(friendlyError(cause));
      } finally {
        if (active) setSearchLoading(false);
      }
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  async function toggleNotifications() {
    const willOpen = !notificationsOpen;
    setNotificationsOpen(willOpen);
    setUserMenuOpen(false);
    if (!willOpen) return;
    setNotificationLoading(true);
    setNotificationError('');
    try {
      setOpenComplaints(await listRecords<Complaint>('complaints', { status: 'open', sort: 'reported_at', direction: 'desc' }));
    } catch (cause) {
      setNotificationError(friendlyError(cause));
    } finally {
      setNotificationLoading(false);
    }
  }

  function openResult(result: SearchResult) {
    setSearchOpen(false);
    setQuery('');
    navigate(result.path);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink aria-label="FacilityOps home" className="brand" to="/dashboard">
          <span className="brand-icon">F</span>
          <span className="brand-copy"><strong>FacilityOps</strong><small>SMART FACILITY MANAGEMENT</small></span>
        </NavLink>
        <p className="nav-heading">WORKSPACE</p>
        <nav aria-label="Main navigation">
          {links.map((link) => (
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} key={link.to} to={link.to}>
              <Icon className="nav-icon" name={link.icon} size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer"><span className="online-dot" /><span>System operational</span></div>
      </aside>
      <div className="content-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Facility Operations</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{currentPage}</strong>
          </div>
          <div className="header-tools">
            <div className="global-search-wrap">
                <button aria-label="Search records" className="mobile-search-trigger" onClick={() => { searchInput.current?.focus(); setSearchOpen(true); }} type="button"><Icon name="search" size={16} /></button>
                <Icon className="desktop-search-icon" name="search" size={16} />
              <input
                aria-label="Search facilities, inspections, complaints, and employees"
                aria-expanded={searchOpen}
                aria-controls="facilityops-search-results"
                autoComplete="off"
                onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search records"
                ref={searchInput}
                type="search"
                value={query}
              />
              <kbd>Ctrl K</kbd>
              {searchOpen && query.trim() && (
                <div aria-label="Search results" className="popover search-popover" id="facilityops-search-results" role="region">
                  {searchLoading && <p className="popover-state">Searching records…</p>}
                  {searchError && <p className="popover-error" role="alert">{searchError}</p>}
                  {!searchLoading && !searchError && results.length === 0 && <p className="popover-state">No matching records.</p>}
                  {results.map((result) => (
                    <button className="search-result" key={`${result.kind}-${result.id}`} onClick={() => openResult(result)} type="button">
                      <span className="result-icon"><Icon name={result.kind === 'facilities' ? 'facilities' : result.kind === 'inspections' ? 'inspections' : result.kind === 'complaints' ? 'complaints' : 'employees'} size={16} /></span>
                      <span className="result-copy"><strong>{result.label}</strong><small>{resourceLabels[result.kind]}{result.detail ? ` · ${result.detail}` : ''}</small></span>
                      {result.status && <StatusBadge status={result.status} />}
                    </button>
                  ))}
                  {results.length > 0 && <p className="popover-footnote">Showing up to 8 matching records</p>}
                </div>
              )}
            </div>
            <div className="header-menu-wrap">
              <button aria-expanded={notificationsOpen} aria-label="Open complaint notifications" className="header-icon-button" onClick={() => void toggleNotifications()} type="button">
                <Icon name="bell" size={18} />
              </button>
              {notificationsOpen && <div aria-label="Open complaint notifications" className="popover notification-popover" role="region">
                <div className="popover-heading"><strong>Open complaints</strong><span>{openComplaints.length}</span></div>
                {notificationLoading && <p className="popover-state">Loading current issues…</p>}
                {notificationError && <p className="popover-error" role="alert">{notificationError}</p>}
                {!notificationLoading && !notificationError && openComplaints.length === 0 && <p className="popover-state">No open complaints.</p>}
                {!notificationLoading && openComplaints.slice(0, 5).map((complaint) => (
                  <button className="notification-item" key={complaint.id} onClick={() => { setNotificationsOpen(false); navigate(`/complaints/${complaint.id}`); }} type="button">
                    <span><strong>{complaint.subject}</strong><small>{complaint.facility_name}</small></span><StatusBadge status={complaint.priority} />
                  </button>
                ))}
                <button className="popover-link" onClick={() => { setNotificationsOpen(false); navigate('/complaints'); }} type="button">View complaints</button>
              </div>}
            </div>
            <div className="header-menu-wrap">
              <button aria-expanded={userMenuOpen} aria-haspopup="menu" className="profile-chip" onClick={() => { setUserMenuOpen((value) => !value); setNotificationsOpen(false); }} type="button">
                <span className="avatar">FO</span><span className="profile-copy"><strong>Facility Operator</strong><small>Operations</small></span><Icon className="profile-chevron" name="chevron" size={15} />
              </button>
              {userMenuOpen && <div className="popover user-popover" role="menu">
                <div className="user-menu-heading"><span className="avatar">FO</span><span><strong>Facility Operator</strong><small>Operations workspace</small></span></div>
                <div className="user-menu-links">{links.slice(1).map((link) => <button key={link.to} onClick={() => { setUserMenuOpen(false); navigate(link.to); }} role="menuitem" type="button"><Icon name={link.icon} size={16} />{link.label}</button>)}</div>
              </div>}
            </div>
          </div>
        </header>
        <main className="page-content"><Outlet /></main>
        <footer className="app-footer">
          <span className="footer-brand"><strong>FacilityOps</strong><span>: Smart Facility Management</span></span>
          <span className="footer-credit">Project developed by{' '}<strong>Bhushan Kailas Bade</strong>{' '}<span>(PugArch intern)</span></span>
          <span className="footer-copyright">© FacilityOps</span>
        </footer>
      </div>
    </div>
  );
}
