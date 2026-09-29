import handler from '../_handler.js';

export default function complaintsHandler(req, res) {
  req.query = req.query || {};
  req.query.path = ['complaints'];
  return handler(req, res);
}
