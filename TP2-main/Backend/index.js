import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes     from './routes/auth.routes.js';
import dataRoutes     from './routes/data.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import portalRoutes   from './routes/portal.routes.js';
import metricsRoutes  from './routes/metrics.routes.js';
import periodRoutes   from './routes/period.routes.js';

const app = express();

app.use(helmet());

// En desarrollo acepta cualquier origen local (el proxy de Vite llama desde localhost)
// En producción usa CLIENT_URL del .env
const corsOrigin = process.env.NODE_ENV === 'production'
  ? process.env.CLIENT_URL
  : (origin, cb) => cb(null, true);   // permite todo en dev

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
app.use('/api/metrics',  metricsRoutes);
app.use('/api/periods',  periodRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Servidor en http://localhost:${process.env.PORT}`);
  });
});
