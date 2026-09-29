import { createResourceModel } from '../models/resourceModel.js';

export function createResourceService(pool, resource) {
  const model = createResourceModel(pool, resource);

  async function list(filters) {
    return model.list(filters);
  }

  async function get(id) {
    const record = await model.findById(id);
    if (!record) return null;

    if (resource === 'facilities') {
      const [inspections] = await pool.execute(
        `SELECT i.*, f.name AS facility_name, e.name AS inspector_name
         FROM inspections i JOIN facilities f ON f.id = i.facility_id
         LEFT JOIN employees e ON e.id = i.inspector_id
         WHERE i.facility_id = ? ORDER BY i.inspected_at DESC`,
        [id],
      );
      const [complaints] = await pool.execute(
        `SELECT c.*, f.name AS facility_name, u.name AS submitter_name
         FROM complaints c JOIN facilities f ON f.id = c.facility_id
         LEFT JOIN users u ON u.id = c.submitted_by
         WHERE c.facility_id = ? ORDER BY c.reported_at DESC`,
        [id],
      );
      return { ...record, inspections, complaints };
    }
    return record;
  }

  async function create(record) {
    return model.create(record);
  }

  async function update(id, record) {
    return model.update(id, record);
  }

  async function remove(id) {
    return model.remove(id);
  }

  return { list, get, create, update, remove };
}
