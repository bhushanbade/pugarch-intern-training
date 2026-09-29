const resources = {
  facilities: {
    table: 'facilities',
    alias: 'f',
    joins: 'JOIN departments d ON d.id = f.department_id',
    select: `f.*, d.name AS department_name`,
    searchable: ['f.name', 'f.category', 'f.location', 'd.name'],
    sortable: { name: 'f.name', category: 'f.category', location: 'f.location', condition_score: 'f.condition_score', status: 'f.status' },
    filters: ['department_id', 'status', 'category'],
    writeFields: ['department_id', 'name', 'category', 'location', 'condition_score', 'status', 'notes'],
    order: 'f.name ASC',
  },
  inspections: {
    table: 'inspections',
    alias: 'i',
    joins: 'JOIN facilities f ON f.id = i.facility_id LEFT JOIN employees e ON e.id = i.inspector_id',
    select: 'i.*, f.name AS facility_name, e.name AS inspector_name',
    searchable: ['f.name', 'e.name', 'i.findings'],
    sortable: { inspected_at: 'i.inspected_at', rating: 'i.rating', status: 'i.status', facility_name: 'f.name' },
    filters: ['facility_id', 'inspector_id', 'rating', 'status'],
    writeFields: ['facility_id', 'inspector_id', 'rating', 'status', 'inspected_at', 'findings'],
    order: 'i.inspected_at DESC',
  },
  complaints: {
    table: 'complaints',
    alias: 'c',
    joins: 'JOIN facilities f ON f.id = c.facility_id LEFT JOIN users u ON u.id = c.submitted_by',
    select: 'c.*, f.name AS facility_name, u.name AS submitter_name',
    searchable: ['f.name', 'u.name', 'c.subject', 'c.description'],
    sortable: { reported_at: 'c.reported_at', priority: 'c.priority', status: 'c.status', subject: 'c.subject' },
    filters: ['facility_id', 'submitted_by', 'priority', 'status'],
    writeFields: ['facility_id', 'submitted_by', 'subject', 'description', 'priority', 'status', 'reported_at', 'resolved_at', 'resolution_notes'],
    order: 'c.reported_at DESC',
  },
  employees: {
    table: 'employees',
    alias: 'e',
    joins: 'JOIN departments d ON d.id = e.department_id',
    select: 'e.*, d.name AS department_name',
    searchable: ['e.name', 'e.email', 'e.position', 'd.name'],
    sortable: { name: 'e.name', email: 'e.email', position: 'e.position', hired_on: 'e.hired_on' },
    filters: ['department_id'],
    writeFields: ['department_id', 'name', 'email', 'position', 'hired_on'],
    order: 'e.name ASC',
  },
};

export function createResourceModel(pool, resource) {
  const definition = resources[resource];
  if (!definition) throw new Error(`Unknown resource: ${resource}`);

  async function list(filters = {}) {
    const clauses = [];
    const values = [];
    if (filters.search) {
      clauses.push(`(${definition.searchable.map((column) => `${column} LIKE ?`).join(' OR ')})`);
      values.push(...definition.searchable.map(() => `%${filters.search}%`));
    }
    for (const column of definition.filters) {
      if (filters[column] !== undefined) {
        clauses.push(`${definition.alias}.${column} = ?`);
        values.push(filters[column]);
      }
    }
    const sort = definition.sortable[filters.sort] ?? definition.order.split(' ').slice(0, -1).join(' ');
    const direction = filters.direction?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const order = filters.direction ? `${sort} ${direction}` : definition.order;
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const [rows] = await pool.execute(
      `SELECT ${definition.select} FROM ${definition.table} ${definition.alias} ${definition.joins} ${where} ORDER BY ${order}`,
      values,
    );
    return rows;
  }

  async function findById(id, connection = pool) {
    const [rows] = await connection.execute(
      `SELECT ${definition.select} FROM ${definition.table} ${definition.alias} ${definition.joins} WHERE ${definition.alias}.id = ? LIMIT 1`,
      [id],
    );
    return rows[0] ?? null;
  }

  async function create(record, connection = pool) {
    const fields = definition.writeFields.filter((field) => Object.hasOwn(record, field));
    const [result] = await connection.execute(
      `INSERT INTO ${definition.table} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,
      fields.map((field) => record[field]),
    );
    return findById(result.insertId, connection);
  }

  async function update(id, record, connection = pool) {
    const fields = definition.writeFields.filter((field) => Object.hasOwn(record, field));
    if (fields.length === 0) return findById(id, connection);
    await connection.execute(
      `UPDATE ${definition.table} SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE id = ?`,
      [...fields.map((field) => record[field]), id],
    );
    return findById(id, connection);
  }

  async function remove(id, connection = pool) {
    const [result] = await connection.execute(`DELETE FROM ${definition.table} WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }

  return { list, findById, create, update, remove };
}
