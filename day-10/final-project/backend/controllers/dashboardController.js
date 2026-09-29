import { asyncHandler } from '../utils/asyncHandler.js';

export function createDashboardController(service) {
  return {
    stats: asyncHandler(async (_request, response) => {
      response.json({ data: await service.getStats() });
    }),
    performance: asyncHandler(async (_request, response) => {
      response.json({ data: await service.getPerformance() });
    }),
  };
}
