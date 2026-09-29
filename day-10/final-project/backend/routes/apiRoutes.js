import { Router } from 'express';
import { createDashboardController } from '../controllers/dashboardController.js';
import { createReferenceController } from '../controllers/referenceController.js';
import { createResourceRouter } from './resourceRoutes.js';
import { createDashboardService } from '../services/dashboardService.js';

export function createApiRouter(pool) {
  const router = Router();
  const dashboard = createDashboardController(createDashboardService(pool));
  const reference = createReferenceController(pool);
  router.get('/dashboard/stats', dashboard.stats);
  router.get('/performance', dashboard.performance);
  router.get('/departments', reference.departments);
  router.get('/inspectors', reference.inspectors);
  for (const resource of ['facilities', 'inspections', 'complaints', 'employees']) {
    router.use(`/${resource}`, createResourceRouter(pool, resource));
  }
  return router;
}
