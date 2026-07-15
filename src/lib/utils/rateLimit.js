const hits = new Map();

export function rateLimit({ action, max = 30, windowMs = 60000 }) {
  const now = Date.now();
  const key = `${action}`;
  const entry = hits.get(key);

  if (!entry || now - entry.start > windowMs) {
    hits.set(key, { start: now, count: 1 });
    return { allowed: true };
  }

  entry.count++;
  if (entry.count > max) {
    return { allowed: false, retryAfter: Math.ceil((windowMs - (now - entry.start)) / 1000) };
  }

  return { allowed: true };
}
