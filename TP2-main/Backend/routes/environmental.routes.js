import { Router } from 'express';
import { getDashboard } from '../controllers/environmental.controller.js';

const router = Router();

/**
 * GET /environmental-impact
 * Ruta PÚBLICA — sin verifyToken ni checkRole.
 * Renderiza el dashboard HTML de monitoreo de huella de carbono.
 */
router.get('/', getDashboard);

export default router;
