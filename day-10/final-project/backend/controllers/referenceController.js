import { asyncHandler } from '../utils/asyncHandler.js';

export function createReferenceController(pool) {
  return {
    departments: asyncHandler(async (_request, response) => {
      const [data] = await pool.execute('SELECT id, name FROM departments ORDER BY name');
      response.json({ data });
    }),
    inspectors: asyncHandler(async (_request, response) => {
      const [data] = await pool.execute('SELECT id, name, email, position FROM employees ORDER BY name');
      response.json({ data });
    }),
  };
}
