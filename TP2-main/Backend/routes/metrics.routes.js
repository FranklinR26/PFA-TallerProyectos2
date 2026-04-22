import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getMetrics }  from '../controllers/metrics.controller.js';

const router = Router();

router.use(verifyToken);
router.get('/', getMetrics);

export default router;
