import { Routes } from '@angular/router';
import { pendingInspectionGuard } from './core/guards/pending-inspection.guard';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { FacilityDetailPage } from './pages/facility-detail/facility-detail.page';
import { FacilitiesPage } from './pages/facilities/facilities.page';
import { InspectionFormPage } from './pages/inspection-form/inspection-form.page';
import { InspectionsPage } from './pages/inspections/inspections.page';

export const routes: Routes = [
  { path: '', component: DashboardPage, title: 'Dashboard | Facility Inspection' },
  { path: 'facilities', component: FacilitiesPage, title: 'Facilities | Facility Inspection' },
  { path: 'facilities/:id', component: FacilityDetailPage, title: 'Facility details | Facility Inspection' },
  { path: 'inspections', component: InspectionsPage, title: 'Inspection history | Facility Inspection' },
  {
    path: 'inspections/new',
    component: InspectionFormPage,
    canDeactivate: [pendingInspectionGuard],
    title: 'New inspection | Facility Inspection',
  },
  { path: '**', redirectTo: '' },
];
