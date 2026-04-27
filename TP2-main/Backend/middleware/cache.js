import { PERF } from '../config/performance.js';

const store = new Map();

export function cacheMiddleware(ttlMs = PERF.METRICS_CACHE_TTL_MS) {
  return (req, res, next) => {
    if (req.method !== 'GET') return next();
    const key    = req.originalUrl;
    const cached = store.get(key);
    if (cached && Date.now() - cached.ts < ttlMs) {
      return res.json({ ...cached.data, _cached: true });
    }
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode === 200) store.set(key, { data, ts: Date.now() });
      return originalJson(data);
    };
    next();
  };
}

export function invalidateCache(pathFragment) {
  for (const key of store.keys()) {
    if (key.includes(pathFragment)) store.delete(key);
  }
}
