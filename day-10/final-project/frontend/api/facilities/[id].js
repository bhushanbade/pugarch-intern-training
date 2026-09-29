import handler from '../_handler.js';

export default function facilityDetailHandler(req, res) {
  req.query = req.query || {};
  req.query.path = ['facilities', req.query.id];
  return handler(req, res);
}
