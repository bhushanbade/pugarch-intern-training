import handler from './_handler.js';

export default function employeesHandler(req, res) {
  req.query = req.query || {};
  if (!req.query.path) {
    req.query.path = ['employees'];
  }
  return handler(req, res);
}
