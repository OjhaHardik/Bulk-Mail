// Open tracking: GET /api/o?t=<token> returns a 1x1 transparent GIF and logs an open.
import { waitUntil } from '@vercel/functions';
import { callSheet } from '../lib/sheet.js';
import { TOKEN_RE } from '../lib/sign.js';

const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

export default function handler(req, res) {
  const t = String(req.query.t || '');
  if (TOKEN_RE.test(t)) {
    // Log after responding so the image never waits on the Sheet.
    waitUntil(
      callSheet('logEvent', { type: 'open', t, ua: req.headers['user-agent'] || '' })
        .catch((err) => console.error(err)),
    );
  }
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.status(200).send(PIXEL);
}
