import { createHmac, timingSafeEqual } from 'node:crypto';

// Must match sign() in bulk_mailer.py.
export function sign(...parts) {
  return createHmac('sha256', process.env.TRACKING_SECRET)
    .update(parts.join('\n'))
    .digest('base64url')
    .slice(0, 16);
}

export function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

export const TOKEN_RE = /^[\w-]{8,64}$/;
