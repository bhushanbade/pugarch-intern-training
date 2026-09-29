import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { InspectionsPage } from './pages/InspectionsPage';
import { PerformancePage } from './pages/PerformancePage';

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate replace to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/facilities/:id" element={<FacilitiesPage />} />
        <Route path="/inspections" element={<InspectionsPage />} />
        <Route path="/inspections/:id" element={<InspectionsPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/complaints/:id" element={<ComplaintsPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="*" element={<Navigate replace to="/dashboard" />} />
      </Route>
    </Routes>
  );
}
