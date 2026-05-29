import { Router } from 'express';
import { getSustainabilityReport } from '../controllers/sustainability.controller.js';

const router = Router();

/**
 * GET /api/sustainability
 * Ruta PÚBLICA — sirve el último reporte de GreenFrame (JSON o texto).
 */
router.get('/', getSustainabilityReport);

export default router;
