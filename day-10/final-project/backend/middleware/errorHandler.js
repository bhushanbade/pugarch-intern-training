export function errorHandler(error, request, response, _next) {
  if (error.type === 'validation') {
    return response.status(422).json({ message: error.message, errors: error.errors });
  }
  if (error.status === 400 || error.type === 'entity.parse.failed') {
    return response.status(400).json({ message: error.type === 'entity.parse.failed' ? 'Request body must contain valid JSON.' : error.message, errors: error.errors ?? {} });
  }
  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return response.status(409).json({ message: 'This record is still referenced by other records.' });
  }
  if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
    return response.status(422).json({ message: 'A related record or value is invalid.' });
  }
  if (error.code === 'ER_DUP_ENTRY') {
    return response.status(409).json({ message: 'A record with this unique value already exists.' });
  }

  console.error(`${request.method} ${request.originalUrl}:`, error);
  return response.status(500).json({ message: 'An unexpected server error occurred.' });
}

export function notFound(request, response) {
  response.status(404).json({ message: `Route ${request.method} ${request.path} was not found.` });
}
