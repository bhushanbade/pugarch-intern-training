export function validateRecord(resource, payload, partial = false) {
  const definitions = {
    facilities: {
      department_id: ['integer', true],
      name: ['text', true, 150],
      category: ['text', true, 100],
      location: ['text', true, 255],
      condition_score: ['range', false, 1, 5],
      status: ['enum', false, ['operational', 'maintenance', 'offline']],
      notes: ['optionalText', false, 16000],
    },
    inspections: {
      facility_id: ['integer', true],
      inspector_id: ['nullableInteger', false],
      rating: ['nullableRange', false, 1, 5],
      status: ['enum', false, ['scheduled', 'completed', 'failed']],
      inspected_at: ['date', true],
      findings: ['text', true, 16000],
    },
    complaints: {
      facility_id: ['integer', true],
      submitted_by: ['nullableInteger', false],
      subject: ['text', true, 180],
      description: ['text', true, 16000],
      priority: ['enum', true, ['low', 'medium', 'high', 'critical']],
      status: ['enum', true, ['open', 'in_progress', 'resolved', 'closed']],
      reported_at: ['date', true],
      resolution_notes: ['optionalText', false, 16000],
    },
    employees: {
      department_id: ['integer', true],
      name: ['text', true, 150],
      email: ['email', true],
      position: ['text', true, 120],
      hired_on: ['dateOnly', true],
    },
  };

  const fields = definitions[resource];
  const errors = {};
  const normalized = {};
  if (!fields) throw new Error(`Unknown validated resource: ${resource}`);
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    const error = new Error('Request body must be a JSON object.');
    error.type = 'validation';
    error.errors = { body: error.message };
    throw error;
  }

  for (const [field, [type, required, first, second]] of Object.entries(fields)) {
    if (!Object.hasOwn(payload, field)) {
      if (required && !partial) errors[field] = `${field} is required.`;
      continue;
    }
    const value = payload[field];
    if (value === null || value === '') {
      if (required) errors[field] = `${field} is required.`;
      else normalized[field] = null;
      continue;
    }

    if (type === 'integer' || type === 'nullableInteger') {
      if (!Number.isSafeInteger(Number(value)) || Number(value) < 1) errors[field] = `${field} must be a positive integer.`;
      else normalized[field] = Number(value);
    } else if (type === 'text' || type === 'optionalText') {
      if (typeof value !== 'string' || !value.trim() || value.length > first) errors[field] = `${field} must be text up to ${first} characters.`;
      else normalized[field] = value.trim();
    } else if (type === 'range' || type === 'nullableRange') {
      if (!Number.isInteger(Number(value)) || Number(value) < first || Number(value) > second) errors[field] = `${field} must be between ${first} and ${second}.`;
      else normalized[field] = Number(value);
    } else if (type === 'enum') {
      if (typeof value !== 'string' || !first.includes(value)) errors[field] = `${field} must be one of: ${first.join(', ')}.`;
      else normalized[field] = value;
    } else if (type === 'date' || type === 'dateOnly') {
      const localDateTime = type === 'date' && typeof value === 'string' ? normalizeLocalDateTime(value) : null;
      const parsed = new Date(value);
      if (typeof value !== 'string' || !value.trim() || (type === 'dateOnly' && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(parsed.getTime()))) || (type === 'date' && (localDateTime === null || (localDateTime === undefined && Number.isNaN(parsed.getTime()))))) {
        errors[field] = `${field} must be a valid ${type === 'dateOnly' ? 'date' : 'date and time'}.`;
      } else normalized[field] = type === 'dateOnly' ? value : localDateTime ?? parsed.toISOString().slice(0, 19).replace('T', ' ');
    } else if (type === 'email') {
      if (typeof value !== 'string' || value.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[field] = `${field} must be a valid email address up to 255 characters.`;
      else normalized[field] = value.trim().toLowerCase();
    }
  }

  for (const field of Object.keys(payload)) {
    if (!Object.hasOwn(fields, field)) errors[field] = `${field} is not an allowed field.`;
  }
  if (resource === 'inspections' && normalized.status !== 'scheduled' && normalized.rating == null) {
    errors.rating = 'A rating from 1 to 5 is required for completed or failed inspections.';
  }
  if (Object.keys(errors).length) {
    const error = new Error('Please correct the highlighted fields.');
    error.type = 'validation';
    error.errors = errors;
    throw error;
  }
  return normalized;
}

function normalizeLocalDateTime(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) return undefined;

  const [, year, month, day, hour, minute, second = '00'] = match;
  const parsed = new Date(0);
  parsed.setUTCFullYear(Number(year), Number(month) - 1, Number(day));
  parsed.setUTCHours(Number(hour), Number(minute), Number(second), 0);
  if (parsed.getUTCFullYear() !== Number(year) || parsed.getUTCMonth() !== Number(month) - 1
    || parsed.getUTCDate() !== Number(day) || parsed.getUTCHours() !== Number(hour)
    || parsed.getUTCMinutes() !== Number(minute) || parsed.getUTCSeconds() !== Number(second)) return null;

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function validateListQuery(resource, query) {
  const integerFilters = {
    facilities: ['department_id', 'condition_score'],
    inspections: ['facility_id', 'inspector_id', 'rating'],
    complaints: ['facility_id', 'submitted_by'],
    employees: ['department_id'],
  };
  const allowedSorts = {
    facilities: ['name', 'category', 'location', 'condition_score', 'status'],
    inspections: ['inspected_at', 'rating', 'status', 'facility_name'],
    complaints: ['reported_at', 'priority', 'status', 'subject'],
    employees: ['name', 'email', 'position', 'hired_on'],
  };
  const allowed = new Set([
    'search', 'sort', 'direction', ...(integerFilters[resource] ?? []),
    ...(resource === 'facilities' ? ['status', 'category'] : []),
    ...(resource === 'inspections' ? ['status'] : []),
    ...(resource === 'complaints' ? ['status', 'priority'] : []),
  ]);
  const errors = {};
  for (const [key, value] of Object.entries(query)) {
    if (typeof value !== 'string') errors[key] = `${key} must have a single text value.`;
    else if (!allowed.has(key)) errors[key] = `${key} is not a supported filter.`;
    else if (integerFilters[resource]?.includes(key) && (!/^\d+$/.test(value) || Number(value) < 1)) errors[key] = `${key} must be a positive integer.`;
    else if (key === 'search' && value.length > 255) errors[key] = 'search must be 255 characters or fewer.';
    else if (key === 'sort' && value && !allowedSorts[resource].includes(value)) errors[key] = `sort must be one of: ${allowedSorts[resource].join(', ')}.`;
    else if (key === 'direction' && !['asc', 'desc'].includes(value.toLowerCase())) errors[key] = 'direction must be asc or desc.';
    else if (key === 'direction' && !['asc', 'desc'].includes(value.toLowerCase())) errors[key] = 'direction must be asc or desc.';
    else if (key === 'status' && !statusValues[resource]?.includes(value)) errors[key] = `status is invalid for ${resource}.`;
    else if (key === 'priority' && !['low', 'medium', 'high', 'critical'].includes(value)) errors[key] = 'priority is invalid.';
    else if (key === 'condition_score' && (Number(value) < 1 || Number(value) > 5)) errors[key] = 'condition_score must be between 1 and 5.';
    else if (key === 'rating' && (Number(value) < 1 || Number(value) > 5)) errors[key] = 'rating must be between 1 and 5.';
  }
  if (Object.keys(errors).length) {
    const error = new Error('One or more filters are invalid.');
    error.status = 400;
    error.errors = errors;
    throw error;
  }
}

const statusValues = {
  facilities: ['operational', 'maintenance', 'offline'],
  inspections: ['scheduled', 'completed', 'failed'],
  complaints: ['open', 'in_progress', 'resolved', 'closed'],
};
