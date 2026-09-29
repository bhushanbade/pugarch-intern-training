import handler from '../_handler.js';

export default function inspectionDetailHandler(req, res) {
  req.query = req.query || {};
  req.query.path = ['inspections', req.query.id];
  return handler(req, res);
}
