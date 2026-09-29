import handler from '../_handler.js';

export default function employeesHandler(req, res) {
  req.query = req.query || {};
  req.query.path = ['employees'];
  return handler(req, res);
}
