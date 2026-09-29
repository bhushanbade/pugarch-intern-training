import handler from '../_handler.js';

export default function complaintDetailHandler(req, res) {
  req.query = req.query || {};
  req.query.path = ['complaints', req.query.id];
  return handler(req, res);
}
