import { Router } from 'express';
import { getEnvironmentalImpactJson } from '../controllers/environmental.controller.js';

const router = Router();

/**
 * GET /api/environmental-impact
 * Ruta PÚBLICA — retorna JSON para el dashboard React.
 */
router.get('/', getEnvironmentalImpactJson);

export default router;

