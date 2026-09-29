import handler from './_handler.js';

export default function facilitiesHandler(req, res) {
  req.query = req.query || {};
  if (!req.query.path) {
    req.query.path = ['facilities'];
  }
  return handler(req, res);
}
