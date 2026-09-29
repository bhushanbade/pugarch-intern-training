import { asyncHandler } from '../utils/asyncHandler.js';
import { validateListQuery, validateRecord } from '../middleware/validate.js';

export function createResourceController(resource, service) {
  return {
    list: asyncHandler(async (request, response) => {
      validateListQuery(resource, request.query);
      response.json({ data: await service.list(request.query) });
    }),
    get: asyncHandler(async (request, response) => {
      const record = await service.get(request.params.id);
      if (!record) return response.status(404).json({ message: `${resource} record not found.` });
      response.json({ data: record });
    }),
    create: asyncHandler(async (request, response) => {
      const input = validateRecord(resource, request.body);
      if (resource === 'complaints' && ['resolved', 'closed'].includes(input.status)) {
        input.resolved_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }
      const record = await service.create(input);
      response.status(201).json({ data: record, message: `${resource} record created.` });
    }),
    update: asyncHandler(async (request, response) => {
      const input = validateRecord(resource, request.body);
      if (resource === 'complaints' && Object.hasOwn(input, 'status')) {
        if (['resolved', 'closed'].includes(input.status)) input.resolved_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        else input.resolved_at = null;
      }
      const record = await service.update(request.params.id, input);
      if (!record) return response.status(404).json({ message: `${resource} record not found.` });
      response.json({ data: record, message: `${resource} record updated.` });
    }),
    patch: asyncHandler(async (request, response) => {
      const input = validateRecord(resource, request.body, true);
      if (resource === 'complaints' && Object.hasOwn(input, 'status')) {
        if (['resolved', 'closed'].includes(input.status)) input.resolved_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        else input.resolved_at = null;
      }
      const record = await service.update(request.params.id, input);
      if (!record) return response.status(404).json({ message: `${resource} record not found.` });
      response.json({ data: record, message: `${resource} record updated.` });
    }),
    remove: asyncHandler(async (request, response) => {
      const deleted = await service.remove(request.params.id);
      if (!deleted) return response.status(404).json({ message: `${resource} record not found.` });
      response.json({ message: `${resource} record deleted.` });
    }),
  };
}
