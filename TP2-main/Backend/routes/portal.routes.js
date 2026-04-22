import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRole }   from '../middleware/checkRole.js';
import {
  getPortalData, updateAvailability, enroll, unenroll,
  joinWaitlist, leaveWaitlist,
} from '../controllers/portal.controller.js';

const router = Router();

router.use(verifyToken);
router.use(checkRole('estudiante', 'admin', 'coordinador', 'docente'));

router.get   ('/',                   getPortalData);
router.put   ('/availability',       updateAvailability);
router.post  ('/enroll/:courseId',   enroll);
router.delete('/enroll/:courseId',   unenroll);
router.post  ('/waitlist/:courseId', joinWaitlist);
router.delete('/waitlist/:courseId', leaveWaitlist);

export default router;
