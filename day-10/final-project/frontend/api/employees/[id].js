import handler from '../_handler.js';

export default function employeeDetailHandler(req, res) {
  req.query = req.query || {};
  req.query.path = ['employees', req.query.id];
  return handler(req, res);
}
