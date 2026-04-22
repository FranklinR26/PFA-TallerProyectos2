import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRole }   from '../middleware/checkRole.js';
import { generate, getActive, getHistory, activate, getFull, patchEntry, validateSchedule } from '../controllers/schedule.controller.js';

const router = Router();

router.use(verifyToken);

router.post  ('/generate',     checkRole('admin', 'coordinador'), generate);
router.get   ('/validate',     checkRole('admin', 'coordinador'), validateSchedule);
router.get   ('/active',       getActive);
router.get   ('/full',         getFull);
router.get   ('/history',      getHistory);
router.patch ('/entry',        checkRole('admin', 'coordinador'), patchEntry);
router.put   ('/:id/activate', checkRole('admin', 'coordinador'), activate);

export default router;
