import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRole }   from '../middleware/checkRole.js';
import { getPeriods, createPeriod, activatePeriod, deletePeriod } from '../controllers/period.controller.js';

const router = Router();

router.use(verifyToken);

const adminCoord = checkRole('admin', 'coordinador');

router.get   ('/',              getPeriods);
router.post  ('/',              adminCoord, createPeriod);
router.put   ('/:id/activate',  adminCoord, activatePeriod);
router.delete('/:id',           adminCoord, deletePeriod);

export default router;
