// Click tracking: GET /api/c?t=<token>&u=<url>&s=<signature> logs a click and redirects.
// The signature stops this from being used as an open redirect to arbitrary sites.
import { waitUntil } from '@vercel/functions';
import { callSheet } from '../lib/sheet.js';
import { sign, safeEqual, TOKEN_RE } from '../lib/sign.js';

export default function handler(req, res) {
  const t = String(req.query.t || '');
  const u = String(req.query.u || '');
  const s = String(req.query.s || '');

  if (!TOKEN_RE.test(t) || !/^https?:\/\//i.test(u) || !safeEqual(s, sign(t, u))) {
    res.status(400).setHeader('Content-Type', 'text/plain').send('Invalid link');
    return;
  }

  waitUntil(
    callSheet('logEvent', { type: 'click', t, url: u, ua: req.headers['user-agent'] || '' })
      .catch((err) => console.error(err)),
  );
  res.setHeader('Cache-Control', 'no-store');
  res.redirect(302, u);
}
