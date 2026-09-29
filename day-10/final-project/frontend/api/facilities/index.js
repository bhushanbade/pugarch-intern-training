import handler from '../_handler.js';

export default function facilitiesHandler(req, res) {
  req.query = req.query || {};
  req.query.path = ['facilities'];
  return handler(req, res);
}
