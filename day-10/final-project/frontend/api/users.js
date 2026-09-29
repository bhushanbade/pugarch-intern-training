import { db, sendJson } from './_db.js';

export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    return res.end();
  }

  if (req.method !== 'GET') {
    return sendJson(res, 405, { message: 'Method Not Allowed' });
  }

  const sorted = [...db.users].sort((a, b) => a.name.localeCompare(b.name));
  return sendJson(res, 200, { data: sorted });
}
