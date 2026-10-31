// Dashboard data: GET /api/stats?campaign=<name>, password in the X-Dashboard-Password header.
import { callSheet } from '../lib/sheet.js';
import { safeEqual } from '../lib/sign.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password || !safeEqual(req.headers['x-dashboard-password'] || '', password)) {
    res.status(401).json({ ok: false, error: 'Wrong password' });
    return;
  }
  try {
    const data = await callSheet('stats', { campaign: String(req.query.campaign || '') });
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ ok: false, error: 'Could not reach the Google Sheet' });
  }
}
