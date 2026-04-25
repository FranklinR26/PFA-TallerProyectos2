import { logger } from '../config/logger.js';
import { PERF }   from '../config/performance.js';

export function performanceMonitor(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const ms        = Date.now() - start;
    const threshold = req.path.includes('/generate')
      ? PERF.SCHEDULE_GENERATION_MS
      : PERF.API_RESPONSE_MS;
    const exceeded  = ms > threshold;
    logger[exceeded ? 'warn' : 'info']('http', {
      method:    req.method,
      path:      req.path,
      status:    res.statusCode,
      ms,
      threshold,
      exceeded,
    });
  });
  next();
}
