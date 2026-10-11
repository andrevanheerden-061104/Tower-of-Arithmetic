// A simple limit per player, so one player can't use up the free Groq
// allowance (about 30 requests a minute for the whole app).
//   limit     requests allowed
//   windowMs  in this many milliseconds
export function rateLimit({ limit, windowMs }) {
  const hits = new Map(); // user id -> times of recent requests

  return (req, res, next) => {
    const key = req.user?.id ?? req.ip;
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      const wait = Math.ceil((windowMs - (now - recent[0])) / 1000);
      res.set('Retry-After', String(wait));
      return res.status(429).json({ error: `Slow down a little: try again in ${wait} seconds.` });
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.clear(); // keep memory small
    next();
  };
}
