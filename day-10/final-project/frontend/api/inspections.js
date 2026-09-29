import handler from './_handler.js';

export default function inspectionsHandler(req, res) {
  req.query = req.query || {};
  if (!req.query.path) {
    req.query.path = ['inspections'];
  }
  return handler(req, res);
}
