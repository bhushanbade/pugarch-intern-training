import { CanDeactivateFn } from '@angular/router';
import { InspectionFormPage } from '../../pages/inspection-form/inspection-form.page';

export const pendingInspectionGuard: CanDeactivateFn<InspectionFormPage> = (page) =>
  page.canLeave();
