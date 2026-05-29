import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB, clearEnvironmentalMetrics } from './config/db.js';
import { logger }              from './config/logger.js';
import { PERF }                from './config/performance.js';
import { performanceMonitor }  from './middleware/performanceMonitor.js';
import { co2Monitor }          from './middleware/co2Monitor.js';
import { cacheMiddleware }     from './middleware/cache.js';
import authRoutes          from './routes/auth.routes.js';
import dataRoutes          from './routes/data.routes.js';
import scheduleRoutes      from './routes/schedule.routes.js';
import portalRoutes        from './routes/portal.routes.js';
import metricsRoutes       from './routes/metrics.routes.js';
import periodRoutes        from './routes/period.routes.js';
import environmentalRoutes from './routes/environmental.routes.js';
import sustainabilityRoutes from './routes/sustainability.routes.js';

const app = express();

app.use(helmet());
app.use(performanceMonitor);
// Medición de huella de carbono (CO2.js) en TODAS las rutas.
app.use(co2Monitor());

const corsOrigin = process.env.NODE_ENV === 'production'
  ? process.env.CLIENT_URL
  : (origin, cb) => cb(null, true);

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Demasiados intentos. Espera 15 minutos.' },
});

app.use('/api/auth',     authLimiter, authRoutes);
app.use('/api/data',     dataRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/portal',   portalRoutes);
app.use('/api/metrics',  cacheMiddleware(), metricsRoutes);
app.use('/api/periods',  periodRoutes);

// Rutas PÚBLICAS de sostenibilidad (sin autenticación).
app.use('/environmental-impact', environmentalRoutes); // dashboard CO2.js
app.use('/api/sustainability',   sustainabilityRoutes); // reporte GreenFrame

app.get('/api/health', (_, res) => res.json({
  status:  'ok',
  uptime:  process.uptime(),
  memory:  process.memoryUsage(),
  targets: PERF,
  ts:      new Date().toISOString(),
}));

connectDB().then(async () => {
  // Limpieza única de métricas ambientales: inicia una nueva sesión de medición.
  await clearEnvironmentalMetrics();
  app.listen(process.env.PORT, () => {
    logger.info('server_started', { port: process.env.PORT, env: process.env.NODE_ENV });
  });
});
